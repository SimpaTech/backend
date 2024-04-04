import{ Usuario } from "../entities/Usuario";
import { adicionarUsuario, listarTodosUsuarios, procurarUsuario, procurarUsuarioPorId, atualizarUsuario } from '../services/UsuarioServices';

class UsuarioController {

    async cadastrarUsuario(req, res) {

        try {
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

            const novaUsuario = adicionarUsuario(data.Nome_Usuario, data.CPF_Usuario, data.Role, data.Senha);
            return res.status(200).json({ message: "Cadastrado com sucesso" });

        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async listarUsuarios(req, res) {
        try {
            const usuarios = await listarTodosUsuarios();
            return res.json(usuarios).status(200);
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async buscarUsuario(req, res) {
        try {
            const data = req.body;
            const usuario = await procurarUsuario(data.CPF_Usuario);
            if (!usuario) {
                return res.json({ message: "Usuário não encontrado!" }).status(404);
            } else {
                return res.json(usuario).status(200);
            }
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async buscarUsuarioPorId(req, res){
        try {
            const idUsuario = req.params.id;
            const usuario = await procurarUsuarioPorId(idUsuario);
            if (!usuario) {
                return res.json({ message: "Usuário não encontrado!" }).status(404);
            } else {
                return res.json(usuario).status(200);
            }
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async editarUsuario(req, res) {
        try {
            const id = req.params.id
            const data = req.body

            const usuarioAtualizado = await atualizarUsuario(id, data);
            return res.status(200).json({ message: "Usuário atualizado com sucesso!", usuario: usuarioAtualizado });
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new UsuarioController();