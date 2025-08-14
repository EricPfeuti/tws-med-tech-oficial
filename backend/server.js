
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const session = require('express-session');
const bcrypt = require('bcrypt');
const methodOverride = require('method-override');

const app = express();
const port = 3001;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'segredo-super-secreto',
    resave: false,
    saveUninitialized: true,
}));

const url = 'mongodb://127.0.0.1:27017/';
const TWSMedTech = 'TWSMedTech';

// PÁGINA INDEX
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// PÁGINA OPTION
app.get('/option', (req, res) => {
    res.sendFile(__dirname + '/pages/escolhaLogin.html');
});

// PÁGINA ERRO PACIENTE
app.get('/erroPaciente', (req, res) => {
    res.sendFile(__dirname + '/pages/erroPaciente.html');
});

// PÁGINA ERRO MÉDICO
app.get('/erroMedico', (req, res) => {
    res.sendFile(__dirname + '/pages/erroMedico.html');
});

// PÁGINA CADASTRO MÉDICO
app.get('/cadastroMedico', (req, res) => {
    res.sendFile(__dirname + '/pages/cadastroMedico.html');
});

// CADASTRO MÉDICO
app.post('/cadastroMedico', async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        await client.connect();
        const banco = client.db(TWSMedTech);
        const collectionMedicos = banco.collection('medicos');

        const medicoExistente = await collectionMedicos.findOne({ nomeMedico: req.body.nomeMedico });

        if (medicoExistente) {
            res.redirect('/erroMedico');
        } else {
            const senhaCriptografada = await bcrypt.hash(req.body.senhaMedico, 10);

            await collectionMedicos.insertOne({
                nomeMedico: req.body.nomeMedico,
                senhaMedico: senhaCriptografada
            });

            res.redirect('/loginMedico');
        }
    } catch (erro){
        res.send('Erro ao registrar médico.');
    } finally {
        client.close();
    }
});

// PÁGINA CADASTRO PACIENTE
app.get('/cadastroPaciente', (req, res) => {
    res.sendFile(__dirname + '/pages/cadastroPaciente.html');
});

// CADASTRO PACIENTE
app.post('/cadastroPaciente', async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        await client.connect();
        const banco = client.db(TWSMedTech);
        const collectionPacientes = banco.collection('pacientes');

        const pacienteExistente = await collectionPacientes.findOne({ nomePaciente: req.body.nomePaciente });

        if (pacienteExistente) {
            res.redirect('/erroPaciente');
        } else {
            const senhaCriptografada = await bcrypt.hash(req.body.senhaPaciente, 10);

            await collectionPacientes.insertOne({
                nomePaciente: req.body.nomePaciente,
                senhaPaciente: senhaCriptografada
            });

            res.redirect('/loginPaciente');
        }
    } catch (erro){
        res.send('Erro ao registrar paciente.');
    } finally {
        client.close();
    }
});

// PÁGINA LOGIN MÉDICO
app.get('/loginMedico', (req, res) => {
    res.sendFile(__dirname + '/pages/loginMedico.html');
});

// LOGIN MÉDICO
app.post('/loginMedico', async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try{
        await client.connect();
        const banco = client.db(TWSMedTech);
        const collectionMedicos = banco.collection('medicos');

        const medico = await collectionMedicos.findOne({ nomeMedico: req.body.nomeMedico });

        if (medico && await bcrypt.compare(req.body.senhaMedico, medico.senhaMedico)){
            req.session.nomeMedico = req.body.nomeMedico;
            res.redirect('/medico');
        } else {
            res.redirect('/erro');
        }
    } catch (erro) {
        res.send('Erro ao realizar login.');
    } finally {
        client.close();
    }
});

// PÁGINA LOGIN PACIENTE
app.get('/loginPaciente', (req, res) => {
    res.sendFile(__dirname + '/pages/loginPaciente.html');
});

// LOGIN PACIENTE
app.post('/loginPaciente', async (req, res) => {
    const client = new MongoClient(url, { useUnifiedTopology: true });

    try{
        await client.connect();
        const banco = client.db(TWSMedTech);
        const collectionPacientes = banco.collection('pacientes');

        const paciente = await collectionPacientes.findOne({ nomePaciente: req.body.nomePaciente });

        if (paciente && await bcrypt.compare(req.body.senhaPaciente, paciente.senhaPaciente)){
            req.session.nomePaciente = req.body.nomePaciente;
            res.redirect('/paciente');
        } else {
            res.redirect('/erro');
        }
    } catch (erro) {
        res.send('Erro ao realizar login.');
    } finally {
        client.close();
    }
});

// PROTEGER ROTA MÉDICO
function protegerRotaMedico(req, res, proximo){
    if (req.session.nomeMedico) {
        proximo();
    } else {
        res.redirect('/loginMedico');
    }
}

// PÁGINA MÉDICO
app.get('/medico', protegerRotaMedico,  (req, res) => {
    res.sendFile(__dirname + '/pages/medico.html');
});

// PROTEGER ROTA PACIENTE
function protegerRotaPaciente(req, res, proximo){
    if (req.session.nomePaciente) {
        proximo();
    } else {
        res.redirect('/loginPaciente');
    }
}

// PÁGINA PACIENTE
app.get('/paciente', protegerRotaPaciente, (req, res) => {
    res.sendFile(__dirname + '/pages/paciente.html');
});

// REUNIÃO MÉDICO com PACIENTE
app.get('/reuniaoPaciente', protegerRotaPaciente, (req, res) => {
    const medicoId = req.session.nomeMedico;
    const pacienteId = req.session.nomePaciente;
    res.render('paciente', { medicoId, pacienteId });
});

// REUNIÃO PACIENTE com MÉDICO
app.get('/reuniaoMedico', protegerRotaMedico, (req, res) => {
    const medicoId = req.session.nomeMedico; 
    const pacienteId = req.session.nomePaciente; 
    res.render('medico', { medicoId, pacienteId });
});

// INFORMAÇÕES CONTA MÉDICO
app.get('/dadosMedico', protegerRotaMedico, async (req, res) => {
    const medicoNome = req.session.nomeMedico;

    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        await client.connect();
        const banco = client.db(TWSMedTech);
        const collectionMedicos = banco.collection('medicos');

        const medico = await collectionMedicos.findOne({ nomeMedico: medicoNome });

        if (medico) {
            res.render('dadosMedico', {
                nomeMedico: medico.nomeMedico
            });
        } else {
            res.status(404).send('Médico não encontrado');
        }
    } catch (erro) {
        res.status(500).send('Erro ao buscar informações');
    } finally {
        client.close();
    }
});

// EDITAR INFORMAÇÕES MÉDICO
app.post('/atualizarInformacoesMedico', protegerRotaMedico, async (req, res) => {
    const nomeMedicoAtual = req.session.nomeMedico;
    const { nomeMedico } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const banco = client.db(TWSMedTech);
        const collectionMedicos = banco.collection('medicos');

        await collectionMedicos.updateOne(
            { nomeMedico: nomeMedicoAtual },
            {
                $set: {
                    nomeMedico: nomeMedico
                }
            }
        );

        req.session.nomeMedico = nomeMedico;

        res.redirect('/medico');
    } catch (erro) {
        res.status(500).send('Erro ao atualizar dados do médico');
    } finally {
        await client.close();
    }
});

// INFORMAÇÕES CONTA PACIENTE
app.get('/dadosPaciente', protegerRotaPaciente, async (req, res) => {
    const pacienteNome = req.session.nomePaciente;

    const client = new MongoClient(url, { useUnifiedTopology: true });

    try {
        await client.connect();
        const banco = client.db(TWSMedTech);
        const collectionPacientes = banco.collection('pacientes');

        const paciente = await collectionPacientes.findOne({ nomePaciente: pacienteNome });

        if (paciente) {
            res.render('dadosPaciente', {
                nomePaciente: paciente.nomePaciente
            });
        } else {
            res.status(404).send('Paciente não encontrado');
        }
    } catch (erro) {
        res.status(500).send('Erro ao buscar informações');
    } finally {
        client.close();
    }
});

// EDITAR INFORMAÇÕES PACIENTE
app.post('/atualizarInformacoesPaciente', protegerRotaPaciente, async (req, res) => {
    const nomePacienteAtual = req.session.nomePaciente;
    const { nomePaciente } = req.body;

    const client = new MongoClient(url);

    try {
        await client.connect();
        const banco = client.db(TWSMedTech);
        const collectionPacientes = banco.collection('pacientes');

        await collectionPacientes.updateOne(
            { nomePaciente: nomePacienteAtual },
            {
                $set: {
                    nomePaciente: nomePaciente
                }
            }
        );

        req.session.nomePaciente = nomePaciente;

        res.redirect('/paciente');
    } catch (erro) {
        res.status(500).send('Erro ao atualizar dados do paciente.');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Servidor Node.js em execução em http://localhost:${port}`);
});