const express = require("express");
const { MongoClient } = require("mongodb");
const session = require("express-session");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const crypto = require("crypto");
require('dotenv').config();

const app = express();
const port = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  session({
    name: "doctor.sid",
    secret: "segredo-super-secreto",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

app.use(cors(corsOptions));

const url = "mongodb://127.0.0.1:27017/";
const TWSMedTech = "TWSMedTech";

app.use(express.static(path.join(__dirname, "frontend/build")));

const chaveCriptografaReuniao = process.env.MEETING_MASTER_KEY;
if(!chaveCriptografaReuniao) {
  console.warn("WARNING: MEETING_MASTER_KEY não definido. Em produção defina uma chave segura em .env");
}

const reuniaoCriptografada = chaveCriptografaReuniao ? Buffer.from(chaveCriptografaReuniao, 'base64') : null;

function encryptBuffer(buffer) {
  if(!reuniaoCriptografada) throw new Error("Reunião Criptografa não configurada");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", reuniaoCriptografada, iv);
  const cipherBuf = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    cipherText: cipherBuf.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  }
}

function decryptToBuffer({ cipherText, iv, tag }) {
  if (!chaveCriptografaReuniao) throw new Error("MASTER_KEY não configurada");
  const decipher = crypto.createDecipheriv("aes-256-gcm", chaveCriptografaReuniao, Buffer.from(iv, 'base64'));
  decipher.setAuthTag(Buffer.from(tag, 'base64'));
  const plain = Buffer.concat([decipher.update(Buffer.from(cipherText, 'base64')), decipher.final()]);
  return plain;
}

// CRIANDO REUNIÃO
app.post('/api/create-meeting', async (req, res) => {
  if (!req.session.doctorName) {
    return res.status(401).json({ erro: "Apenas médicos podem criar reuniões" });
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(TWSMedTech);
    const collectionReunioes = db.collection('reuniões');

    const roomName = `tws-${crypto.randomBytes(12).toString('hex')}`; 

    const key = crypto.randomBytes(32);
    
    const encrypted = encryptBuffer(key);

    const meetingDoc = {
      roomName,
      ownerType: 'doctor',
      ownerName: req.session.doctorName,
      encryptedKey: encrypted.cipherText,
      iv: encrypted.iv,
      tag: encrypted.tag,
      allowed: [],
      createdAt: new Date(),
    };

    await collectionReunioes.insertOne(meetingDoc);

    res.json({ sucesso: true, roomName });
  } catch (err) {
    console.error("create-meeting error:", err);
    res.status(500).json({ erro: "Erro ao criar reunião" });
  } finally {
    await client.close();
  }
});

// AUTORIZANDO PACIENTE
app.post('/api/allow-participant', async (req, res) => {
  const { roomName, participantType, participantName } = req.body;

  if (!req.session.doctorName) return res.status(401).json({ erro: "Apenas médico" });

  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(TWSMedTech);
    const collectionReunioes = db.collection('reuniões');

    const reuniao = await collectionReunioes.findOne({ roomName });
    if (!reuniao) return res.status(404).json({ erro: "Reunião não encontrada" });
    if (reuniao.ownerName !== req.session.doctorName) return res.status(403).json({ erro: "Não autorizado" });

    const already = reuniao.allowed.some(a => a.type === participantType && a.name === participantName);
    if (!already) {
      await collectionReunioes.updateOne({ roomName }, { $push: { allowed: { type: participantType, name: participantName } }});
    }

    res.json({ sucesso: true });
  } catch (err) {
    console.error("allow-participant err:", err);
    res.status(500).json({ erro: "Erro ao autorizar participante" });
  } finally {
    await client.close();
  }
});

// BUSCANDO CHAVE REUNIÃO
app.get('/api/meeting-key/:roomName', async (req, res) => {
  const roomName = req.params.roomName;
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(TWSMedTech);
    const collectionReunioes = db.collection('reuniões');

    const reuniao = await collectionReunioes.findOne({ roomName });
    if (!reuniao) return res.status(404).json({ erro: "Reunião não encontrada" });

    const userDoctor = req.session.doctorName;
    const userPatient = req.session.patientName;
    const isOwner = reuniao.ownerName === userDoctor;
    const isAllowedPatient = reuniao.allowed.some(a => a.type === 'patient' && a.name === userPatient);
    const isAllowedDoctor = reuniao.allowed.some(a => a.type === 'doctor' && a.name === userDoctor); 

    if (!isOwner && !isAllowedPatient && !isAllowedDoctor) {
      return res.status(403).json({ erro: "Não autorizado a obter chave" });
    }

    const plainKeyBuf = decryptToBuffer({
      cipherText: reuniao.encryptedKey,
      iv: reuniao.iv,
      tag: reuniao.tag,
    });

    res.json({ sucesso: true, key: plainKeyBuf.toString('base64') });
  } catch (err) {
    console.error("reuniao-key err:", err);
    res.status(500).json({ erro: "Erro ao obter chave" });
  } finally {
    await client.close();
  }
});

// PERMITIR PACIENTES
app.get("/api/allowed-meetings", async (req, res) => {
  if (!req.session.patientName) return res.status(401).json({ erro: "Não autorizado" });

  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(TWSMedTech);
    const collectionReunioes = db.collection("reuniões");

    const allowedMeetings = await collectionReunioes.find({
      allowed: { $elemMatch: { type: "patient", name: req.session.patientName } }
    }).toArray();

    res.json({ sucesso: true, collectionReunioes: allowedMeetings });
  } catch (err) {
    console.error("Erro ao buscar reuniões:", err);
    res.status(500).json({ erro: "Erro ao buscar reuniões" });
  } finally {
    await client.close();
  }
});

// CADASTRO MÉDICO
app.post("/api/signDoctor", async (req, res) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    const collectionMedicos = banco.collection("medicos");

    const medicoExistente = await collectionMedicos.findOne({
      doctorName: req.body.doctorName,
    });
    if (medicoExistente) {
      return res.status(400).json({ erro: "Médico já existe" });
    }

    const senhaCriptografada = await bcrypt.hash(req.body.doctorPassword, 10);
    await collectionMedicos.insertOne({
      doctorName: req.body.doctorName,
      doctorPassword: senhaCriptografada,
    });

    res.json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao registrar médico" });
  } finally {
    await client.close();
  }
});

// LOGIN MÉDICO
app.post("/api/loginDoctor", async (req, res) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    const collectionMedicos = banco.collection("medicos");

    const medico = await collectionMedicos.findOne({
      doctorName: req.body.doctorName,
    });
    if (
      medico &&
      (await bcrypt.compare(req.body.doctorPassword, medico.doctorPassword))
    ) {
      req.session.doctorName = medico.doctorName;
      return res.json({ sucesso: true, doctorName: medico.doctorName });
    }

    res.status(401).json({ erro: "Login inválido" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no login" });
  } finally {
    await client.close();
  }
});

// CHECANDO SESSÃO MÉDICO
app.get("/api/checkDoctorSession", (req, res) => {
  if (req.session.doctorName) {
    res.json({ logado: true, doctorName: req.session.doctorName });
  } else {
    res.json({ logado: false });
  }
});

// LOGOUT MÉDICO
app.post("/api/logoutDoctor", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao destruir sessão:", err);
      return res.status(500).json({ erro: "Erro ao sair da conta" });
    }

    res.clearCookie("doctor.sid");
    res.json({ message: "Logout realizado com sucesso" });
  });
});

// EDITAR DADOS MÉDICO
app.put("/api/editDoctor", async (req, res) => {
  const client = new MongoClient(url);
  try {
    if (!req.session.doctorName) {
      return res.status(401).json({ erro: "Não autorizado" });
    }

    await client.connect();
    const banco = client.db(TWSMedTech);
    const collectionMedicos = banco.collection("medicos");

    const novoNomeMedico = req.body.newDoctorName;

    const medicoExistente = await collectionMedicos.findOne({
      doctorName: novoNomeMedico,
    });

    if(medicoExistente){
      return res.status(400).json({ erro: "Nome já em uso." });
    }

    const result = await collectionMedicos.updateOne(
      { doctorName: req.session.doctorName },
      { $set: { doctorName: novoNomeMedico } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ erro: "Médico não encontrado." })
    }

    req.session.doctorName = novoNomeMedico;
    res.json({ sucesso: true, doctorName: novoNomeMedico })
  } catch (erro) {
    console.error("Erro ao editar médico:", erro);
    res.status(500).json({ erro: "Erro ao editar médico" });
  } finally {
    await client.close();
  }
});

// <----------------------------------------------> 

// CADASTRO PACIENTE
app.post("/api/signPatient", async (req, res) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    const collectionPacientes = banco.collection("pacientes");

    const pacienteExistente = await collectionPacientes.findOne({
      patientName: req.body.patientName,
    });
    if (pacienteExistente) {
      return res.status(400).json({ erro: "Paciente já existe" });
    }

    const senhaCriptografada = await bcrypt.hash(req.body.patientPassword, 10);
    await collectionPacientes.insertOne({
      patientName: req.body.patientName,
      patientPassword: senhaCriptografada,
    });

    res.json({ sucesso: true });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao registrar paciente" });
  } finally {
    await client.close();
  }
});

// LOGIN PACIENTE
app.post("/api/loginPatient", async (req, res) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    const collectionPacientes = banco.collection("pacientes");

    const paciente = await collectionPacientes.findOne({
      patientName: req.body.patientName,
    });
    if (
      paciente &&
      (await bcrypt.compare(req.body.patientPassword, paciente.patientPassword))
    ) {
      req.session.patientName = paciente.patientName;
      return res.json({ sucesso: true, patientName: paciente.patientName });
    }

    res.status(401).json({ erro: "Login inválido" });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro no login" });
  } finally {
    await client.close();
  }
});

// CHECANDO SESSÃO PACIENTE
app.get("/api/checkPatientSession", (req, res) => {
  if (req.session.patientName) {
    res.json({ logado: true, patientName: req.session.patientName });
  } else {
    res.json({ logado: false });
  }
});

// LOGOUT PACIENTE
app.post("/api/logoutPatient", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Erro ao destruir sessão:", err);
      return res.status(500).json({ erro: "Erro ao sair da conta" });
    }

    res.clearCookie("doctor.sid");
    res.json({ message: "Logout realizado com sucesso" });
  });
});

// EDITAR DADOS PACIENTE
app.put("/api/editPatient", async (req, res) => {
  const client = new MongoClient(url);
  try {
    if (!req.session.patientName) {
      return res.status(401).json({ erro: "Não autorizado" });
    }

    await client.connect();
    const banco = client.db(TWSMedTech);
    const collectionPacientes = banco.collection("pacientes");

    const novoNomePaciente = req.body.newPatientName;

    const pacienteExistente = await collectionPacientes.findOne({
      patientName: novoNomePaciente,
    });

    if(pacienteExistente){
      return res.status(400).json({ erro: "Nome já em uso." });
    }

    const result = await collectionPacientes.updateOne(
      { patientName: req.session.patientName },
      { $set: { patientName: novoNomePaciente } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado." })
    }

    req.session.patientName = novoNomePaciente;

    res.json({ sucesso: true, patientName: novoNomePaciente });
  } catch (erro) {
    console.erro("Erro ao editar paciente:", erro);
    res.status(500).json({ erro: "Erro ao editar paciente" });
  } finally {
    await client.close();
  }
  
})

app.listen(port, () => {
  console.log(`Servidor rodando em: http://localhost:${port}`);
});
