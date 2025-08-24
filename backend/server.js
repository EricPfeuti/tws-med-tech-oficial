const express = require("express");
const { MongoClient } = require("mongodb");
const session = require("express-session");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");

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

    const patientAtual = req.session.patientName;

    const pacienteExistente = await collectionPacientes.findOne({
      patientName: req.body.newPatientName,
    });

    if(pacienteExistente){
      return res.status(400).json({ erro: "Nome já em uso." });
    }

    const result = await collectionPacientes.updateOne(
      { patientName: patientAtual },
      { $set: { patientAtual: req.body.newPatientName } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado." })
    }

    req.session.patientName = req.body.newPatientName;

    res.json({ sucesso: true, patientName: req.body.newPatientName });
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
