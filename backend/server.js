const express = require("express");
const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const session = require("express-session");
const bcrypt = require("bcrypt");
const methodOverride = require("method-override");
const path = require("path");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const http = require("http");
const { Server } = require("socket.io");
const multer = require("multer");
const crypto = require("crypto");

const app = express();
const port = 3001;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true
  }
});

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

const SECRET_KEY = crypto.createHash("sha256").update("minha-chave-super-secreta").digest();
const IV = Buffer.alloc(16, 0);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

function encrypt(text) {
  if(!text) return null;
  const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

function decrypt(text) {
  if (!text) return null;
  try {
    const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, IV);
    let decrypted = decipher.update(text, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Erro ao descriptografar:", err);
    return text;
  }
}

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.static(path.join(__dirname, "frontend/build")));

io.on("connection", (socket) => {
  console.log("Novo socket conectado:", socket.id);

  socket.on("joinRoom", ({ doctorName, patientName }) => {
    const room = `${doctorName}-${patientName}`;
    socket.join(room);
  });

  socket.on("joinDoctor", ({ doctorName }) => {
    const doctorRoom = `doctor-${doctorName}`;
    socket.join(doctorRoom);
    console.log(`Socket ${socket.id} entrou na sala global do médico: ${doctorRoom}`);
  });

  socket.on("joinPatient", ({ patientName }) => {
    const patientRoom = `patient-${patientName}`;
    socket.join(patientRoom);
    console.log(`Socket ${socket.id} entrou na sala global do paciente: ${patientRoom}`);
  });

  socket.on("disconnect", () => {
    console.log(`Socket desconectado: ${socket.id}`);
  });
});

function requireDoctor(req, res, next) {
  if (!req.session.doctorName) {
    return res.status(401).json({ erro: "Apenas médicos podem acessar." });
  }
  next();
}

function requirePatient(req, res, next) {
  if (!req.session.patientName) {
    return res.status(401).json({ erro: "Apenas pacientes podem acessar." });
  }
  next();
}

// CALENDARIO PACIENTE
app.get("/api/calendar/patient", async (req, res) => {
  if (!req.session.patientName) {
    return res.status(401).json({ erro: "Não autenticado como paciente." });
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    const eventos = await banco.collection("calendarioPatients")
      .find({ patientName: req.session.patientName })
      .toArray();

    const decrypted = eventos.map(ev => ({
      ...ev,
      title: decrypt(ev.title),
      description: decrypt(ev.description),
      date: decrypt(ev.date),
      time: decrypt(ev.time),
    }));

    res.json(decrypted);
  } catch (err) {
    console.error("Erro ao listar eventos:", err);
    res.status(500).json({ erro: "Erro ao listar eventos." });
  } finally {
    await client.close();
  }
})

// CRIAR COMPROMISSO PACIENTE
app.post("/api/calendar/patient", async (req, res) => {
  if (!req.session.patientName) {
    return res.status(401).json({ erro: "Não autenticado como paciente." });
  }

  const { title, description, date, time } = req.body;

  const event = {
    patientName: req.session.patientName,
    date: encrypt(date),
    time: encrypt(time),
    title: encrypt(title),
    description: description ? encrypt(description) : null,
    createdAt: new Date(),
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    await banco.collection("calendarioPatients").insertOne(event);
    res.json(event);
  } catch(err) {
    console.error("Erro ao criar o evento:", err);
    res.status(500).json({ erro: "Erro ao criar o evento." })
  } finally {
    await client.close();
  }
});

// EDITAR COMPROMISSO PACIENTE
app.put("/api/calendar/patient/:id", async (req, res) => {
  if (!req.session.patientName) {
    return res.status(401).json({ erro: "Não autenticado como paciente." });
  }

  const { id } = req.params;
  const { title, description, date, time } = req.body;

  const client = new MongoClient(url);
  try {

    await client.connect();
    const db = client.db(TWSMedTech);

    const result = await db.collection("calendarioPatients").findOneAndUpdate(
      { _id: new ObjectId(id), patientName: req.session.patientName },
      {
        $set: {
          title,
          description,
          date,
          time,
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ erro: "Evento não encontrado." });
    }

    res.json(result.value);
  } catch (err) {
    console.error("Erro ao atualizar evento:", err);
    res.status(500).json({ erro: "Erro ao atualizar evento." });
  } finally {
    await client.close();
  }
});

// DELETAR COMPROMISSO PACIENTE
app.delete("/api/calendar/patient/:id", async (req, res) => {
  if (!req.session.patientName) {
    return res.status(401).json({ erro: "Não autenticado como paciente." });
  }

  const { id } = req.params;
  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    await banco.collection("calendarioPatients").deleteOne({
      _id: new ObjectId(id),
      patientName: req.session.patientName,
    });
    res.json({ sucesso: true });
  } catch(err) {
    console.error("Erro ao excluir evento:", err);
    res.status(500).json({ erro: "Erro ao excluir evento." });
  } finally {
    await client.close();
  }
});

// CALENDÁRIO MÉDICO
app.get("/api/calendar/doctor", async (req, res) => {
  if (!req.session.doctorName) {
    return res.status(401).json({ erro: "Não autenticado como médico." });
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    const events = await banco.collection("calendarDoctors")
      .find({ doctorName: req.session.doctorName })
      .toArray();

    const decrypted = events.map(ev => ({
      ...ev,
      title: decrypt(ev.title),
      description: decrypt(ev.description),
      date: decrypt(ev.date),
      time: decrypt(ev.time),
    }));

    res.json(decrypted);
  } catch (err) {
    console.error("Erro ao buscar eventos:", err);
    res.status(500).json({ erro: "Erro ao buscar eventos." });
  } finally {
    await client.close();
  }
});

// POSTAR EVENTO
app.post("/api/calendar/doctor", async (req, res) => {
  if (!req.session.doctorName) {
    return res.status(401).json({ erro: "Não autenticado como médico." });
  }

  const { title, description, date, time } = req.body;
  const event = {
    doctorName: req.session.doctorName,
    title: encrypt(title),
    description: description ? encrypt(description) : null,
    date: encrypt(date),
    time: encrypt(time),
    createdAt: new Date(),
  };

  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    await banco.collection("calendarDoctors").insertOne(event);

    const outgoing = {
      doctorName: event.doctorName,
      title: event.title ? decrypt(event.title) : null,
      description: event.description ? decrypt(event.description) : null,
      date: event.date ? decrypt(event.date) : null,
      time: event.time ? decrypt(event.time) : null,
      createdAt: new Date(),
    };

    res.json(outgoing);
  } catch (err) {
    console.error("Erro ao salvar evento:", err);
    res.status(500).json({ erro: "Erro ao salvar evento." });
  } finally {
    await client.close();
  }
});

// EDITAR COMPROMISSO MÉDICO
app.put("/api/calendar/doctor/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, date, time } = req.body;

  if (!req.session.doctorName) {
    return res.status(401).json({ erro: "Não autenticado como médico." });
  }

  const client = new MongoClient(url);
  try {
    await client.connect();
    const db = client.db(TWSMedTech);

    const result = await db.collection("calendarDoctors").findOneAndUpdate(
      { _id: new ObjectId(id), doctorName: req.session.doctorName },
      {
        $set: {
          title,
          description,
          date,
          time,
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      return res.status(404).json({ erro: "Evento não encontrado." });
    }

    res.json(result.value);
  } catch (err) {
    console.error("Erro ao atualizar evento:", err);
    res.status(500).json({ erro: "Erro ao atualizar evento." });
  } finally {
    await client.close();
  }
});

// DELETAR COMPROMISSO MÉDICO
app.delete("/api/calendar/doctor/:id", async (req, res) => {
  if (!req.session.doctorName) {
    return res.status(401).json({ erro: "Não autenticado como médico." });
  }

  const { id } = req.params;
  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db("TWSMedTech");
    await banco.collection("calendarDoctors").deleteOne({
      _id: new ObjectId(id),
      doctorName: req.session.doctorName,
    });
    res.json({ sucesso: true });
  } catch (err) {
    console.error("Erro ao excluir evento médico:", err);
    res.status(500).json({ erro: "Erro ao excluir evento." });
  } finally {
    await client.close();
  }
});

// LISTAR PACIENTES
app.get("/api/patients", requireDoctor, async (req, res) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    const collectionPacientes = await banco.collection("pacientes").find({}).toArray();
    res.json(collectionPacientes);
  } catch (err) {
    console.error("Erro ao buscar pacientes:", err);
    res.status(500).json({ erro: "Erro ao buscar pacientes." });
  } finally {
    await client.close();
  }
});

// LISTAR MÉDICOS
app.get("/api/doctors", requirePatient, async (req, res) => {
  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    const collectionMedicos = await banco.collection("medicos").find({}).toArray();
    res.json(collectionMedicos);
  } catch (err) {
    console.error("Erro ao buscar médicos:", err);
    res.status(500).json({ erro: "Erro ao buscar médicos." });
  } finally {
    await client.close();
  }
});

// MENSAGENS MÉDICO (com paciente específico)
app.get("/api/messages/doctor/:patientName", async (req, res) => {
  if (!req.session.doctorName) {
    return res.status(401).json({ erro: "Não autenticado como médico." });
  }

  const { patientName } = req.params;
  const doctorName = req.session.doctorName;

  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);

    let mensagens = await banco
      .collection("mensagens")
      .find({ doctorName, patientName })
      .sort({ timestamp: 1 })
      .toArray();
    
    mensagensDecifradas = mensagens.map(msg => ({
      ...msg,
      text: msg.text ? decrypt(msg.text) : null,
      fileUrl: msg.fileUrl ? decrypt(msg.fileUrl) : null,
      originalname: msg.originalname ? decrypt(msg.originalname) : null,
    }))

    res.json(mensagensDecifradas);
  } catch (err) {
    console.error("Erro ao buscar mensagens:", err);
    res.status(500).json({ erro: "Erro ao buscar mensagens." });
  } finally {
    await client.close();
  }
});

app.post("/api/messages/doctor/:patientName", upload.single("file"), async (req, res) => {
  if (!req.session.doctorName) {
    return res.status(401).json({ erro: "Não autenticado como médico." });
  }

  const { patientName } = req.params;
  const { text } = req.body;
  const doctorName = req.session.doctorName;
  const sender = doctorName;
  const file = req.file;

  const newMessage = {
    doctorName,
    patientName,
    sender,
    text: encrypt(text || ""),
    fileUrl: file ? encrypt(`/uploads/${file.filename}`) : null,
    originalname: file ? encrypt(file.originalname) : null,
    timestamp: new Date(),
  };

  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    await banco.collection("mensagens").insertOne(newMessage);

    const outgoing = {
      doctorName: newMessage.doctorName,
      patientName: newMessage.patientName,
      sender: newMessage.sender,
      text: newMessage.text ? decrypt(newMessage.text) : null,
      fileUrl: newMessage.fileUrl ? decrypt(newMessage.fileUrl) : null,
      originalname: newMessage.originalname ? decrypt(newMessage.originalname) : null,
      timestamp: newMessage.timestamp,
    };

    const roomId = `${doctorName}-${patientName}`;
    const doctorRoom = `doctor-${doctorName}`;
    const patientRoom = `patient-${patientName}`;

    io.to(roomId).emit("newMessage", outgoing);

    io.to(doctorRoom).emit("notifyMessage", outgoing);

    io.to(patientRoom).emit("notifyMessage", outgoing);

    res.json(outgoing);
  } catch (err) {
    console.error("Erro ao salvar mensagem:", err);
    res.status(500).json({ erro: "Erro ao salvar mensagem." });
  } finally {
    await client.close();
  }
});

// MENSAGENS PACIENTE (com médico específico)
app.get("/api/messages/patient/:doctorName", async (req, res) => {
  if (!req.session.patientName) {
    return res.status(401).json({ erro: "Não autenticado como paciente." });
  }

  const { doctorName } = req.params;
  const patientName = req.session.patientName;

  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);

    let mensagens = await banco
      .collection("mensagens")
      .find({ doctorName, patientName })
      .sort({ timestamp: 1 })
      .toArray();
    
    mensagensDecifradas = mensagens.map(msg => ({
      ...msg,
      text: msg.text ? decrypt(msg.text) : null,
      fileUrl: msg.fileUrl ? decrypt(msg.fileUrl) : null,
      originalname: msg.originalname ? decrypt(msg.originalname) : null,
    }))

    res.json(mensagensDecifradas);
  } catch (err) {
    console.error("Erro ao buscar mensagens:", err);
    res.status(500).json({ erro: "Erro ao buscar mensagens." });
  } finally {
    await client.close();
  }
});

app.post("/api/messages/patient/:doctorName", upload.single("file"), async (req, res) => {
  if (!req.session.patientName) {
    return res.status(401).json({ erro: "Não autenticado como paciente." });
  }

  const { doctorName } = req.params;
  const { text } = req.body;
  const patientName = req.session.patientName;
  const sender = patientName;
  const file = req.file;
  
  const newMessage = {
    doctorName,
    patientName,
    sender,
    text: encrypt(text || ""),
    fileUrl: file ? encrypt(`/uploads/${file.filename}`) : null,
    originalname: file ? encrypt(file.originalname) : null,
    timestamp: new Date(),
  };

  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    await banco.collection("mensagens").insertOne(newMessage);

    const outgoing = {
      doctorName: newMessage.doctorName,
      patientName: newMessage.patientName,
      sender: newMessage.sender,
      text: newMessage.text ? decrypt(newMessage.text) : null,
      fileUrl: newMessage.fileUrl ? decrypt(newMessage.fileUrl) : null,
      originalname: newMessage.originalname ? decrypt(newMessage.originalname) : null,
      timestamp: newMessage.timestamp,
    };

    const roomId = `${doctorName}-${patientName}`;
    const doctorRoom = `doctor-${doctorName}`;
    const patientRoom = `patient-${patientName}`;

    io.to(roomId).emit("newMessage", outgoing);

    io.to(doctorRoom).emit("notifyMessage", outgoing);

    io.to(patientRoom).emit("notifyMessage", outgoing);

    res.json(outgoing);
  } catch (err) {
    console.error("Erro ao salvar mensagem:", err);
    res.status(500).json({ erro: "Erro ao salvar mensagem." });
  } finally {
    await client.close();
  }
});

// DOWNLOAD FORÇADO
app.get("/download/:filename", (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error("Erro no download:", err);
      res.status(500).send("Erro ao baixar o arquivo");
    }
  });
});

// CRIAR REUNIÃO
app.post("/api/meetings/create", async (req, res) => {
  if (!req.session.doctorName) {
    return res
      .status(401)
      .json({ erro: "Apenas médicos podem criar reuniões" });
  }

  const roomName = `room-${Date.now()}`;

  const client = new MongoClient(url);
  try {
    await client.connect();
    const banco = client.db(TWSMedTech);
    const collectionReunioes = banco.collection("reunioes");

    const meeting = {
      doctorName: req.session.doctorName,
      roomName,
      createdAt: new Date(),
    };

    await collectionReunioes.insertOne(meeting);

    res.json({ sucesso: true, meeting });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: "Erro ao criar reunião" });
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

    if (medicoExistente) {
      return res.status(400).json({ erro: "Nome já em uso." });
    }

    const result = await collectionMedicos.updateOne(
      { doctorName: req.session.doctorName },
      { $set: { doctorName: novoNomeMedico } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ erro: "Médico não encontrado." });
    }

    req.session.doctorName = novoNomeMedico;
    res.json({ sucesso: true, doctorName: novoNomeMedico });
  } catch (erro) {
    console.error("Erro ao editar médico:", erro);
    res.status(500).json({ erro: "Erro ao editar médico" });
  } finally {
    await client.close();
  }
});

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

    if (pacienteExistente) {
      return res.status(400).json({ erro: "Nome já em uso." });
    }

    const result = await collectionPacientes.updateOne(
      { patientName: req.session.patientName },
      { $set: { patientName: novoNomePaciente } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ erro: "Paciente não encontrado." });
    }

    req.session.patientName = novoNomePaciente;

    res.json({ sucesso: true, patientName: novoNomePaciente });
  } catch (erro) {
    console.erro("Erro ao editar paciente:", erro);
    res.status(500).json({ erro: "Erro ao editar paciente" });
  } finally {
    await client.close();
  }
});

server.listen(port, () => {
  console.log(`Servidor rodando em: http://localhost:${port}`);
});
