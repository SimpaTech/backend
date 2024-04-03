const { Usuario } = require ("../entities/Usuario");

const bcrypt = require('bcryptjs')

class UsuarioController {

    static async cadastrarUsuario(req, res) {
        const data = req.body;

        if (!data.Nome_Usuario) {
            return res.json({ message: "Digite um nome..." }).status(500)
        }

        if (!data.CPF_Usuario) {
            return res.json({ message: "Digite um cpf válido..." }).status(500)
        }

        if (!data.Senha) {
            return res.json({ message: "Digite uma senha válida..." }).status(500)
        }

        if (!data.Role) {
            return res.json({ message: "Digite a autorização do usuário..." }).status(500)
        }

        //checar se usuário já existe
        const checarUsuarioExistente = await Usuario.findOne({
            where: {CPF_Usuario: data.CPF_Usuario}
        })

        if (checarUsuarioExistente) {
            return res.json({ message: "Já existe um usuário com este CPF"}).status(500);
        }

        const senhaCriptografada = bcrypt.hashSync(data.Senha, 10);

        try {
            await Usuario.create({
                Nome_Usuario: data.Nome_Usuario,
                CPF_Usuario: data.CPF_Usuario,
                Senha: senhaCriptografada, // Salvar a senha criptografada
                Role: data.Role
            }).save();
            return res.status(200).json({ message: "Cadastrado com sucesso" });
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // static async listarUsuarios(req, res) {
    //     try {
    //         const usuario = await Usuario.find()
    //         return res.json(usuario).status(201)
    //     } catch(error) {
    //         return 
    //     }
    // }
}

export default new UsuarioController();