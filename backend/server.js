const express = require('express');
const { MongoClient } = require('mongodb');
const session = require('express-session');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'segredo-super-secreto',
    resave: false,
    saveUninitialized: true,
}));

const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
};

app.use(cors(corsOptions));

const url = 'mongodb://127.0.0.1:27017/';
const TWSMedTech = 'TWSMedTech';

app.use(express.static(path.join(__dirname, 'frontend/build')));

// CADASTRO MÉDICO
app.post('/api/signDoctor', async (req, res) => {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const banco = client.db(TWSMedTech);
        const collectionMedicos = banco.collection('medicos');

        const medicoExistente = await collectionMedicos.findOne({ doctorName: req.body.doctorName });
        if (medicoExistente) {
            return res.status(400).json({ erro: 'Médico já existe' });
        }

        const senhaCriptografada = await bcrypt.hash(req.body.doctorPassword, 10);
        await collectionMedicos.insertOne({
            doctorName: req.body.doctorName, 
            doctorPassword: senhaCriptografada
        });

        res.json({ sucesso: true });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro ao registrar médico' });
    } finally {
        await client.close();
    }
});

// LOGIN MÉDICO
app.post('/api/loginDoctor', async (req, res) => {
    const client = new MongoClient(url);
    try {
        await client.connect();
        const banco = client.db(TWSMedTech);
        const collectionMedicos = banco.collection('medicos');

        const medico = await collectionMedicos.findOne({ doctorName: req.body.doctorName });
        if (medico && await bcrypt.compare(req.body.doctorPassword, medico.doctorPassword)) {
            req.session.doctorName = medico.doctorName;
            return res.json({ sucesso: true, doctorName: medico.doctorName });
        }

        res.status(401).json({ erro: 'Login inválido' });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: 'Erro no login' });
    } finally {
        await client.close();
    }

});

app.listen(port, () => {
    console.log(`Servidor rodando em: http://localhost:${port}`);
});