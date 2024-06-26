import{ Usuario } from "../entities/Usuario";
import { adicionarUsuario, listarTodosUsuarios, procurarUsuario, procurarUsuarioPorId, atualizarUsuario, deletarUsuario, loginUsuario, obterInformacoesUsuario, logoutUsuario } from '../services/UsuarioServices';

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

            //checar se usuário já existe
            const checarUsuarioExistente = await Usuario.findOne({
                where: {CPF_Usuario: data.CPF_Usuario}
            })

            if (checarUsuarioExistente) {
                return res.status(400).json({ error: "Já existe um usuário com este CPF" });
            }            

            const novaUsuario = adicionarUsuario(data.Nome_Usuario, data.CPF_Usuario, data.Senha);
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

    async removerUsuario(req, res) {
        try {
            const id =req.params.id

            const remocaoUsuario = await deletarUsuario(id);
            return res.status(200).json({ message: "Usuário excluído com sucesso!", usuario: remocaoUsuario});
        } catch (error) {
            if (error.message === "Usuário não encontrado!") {
                return res.status(404).json({ error: error.message });
            } else {
                return res.status(500).json({ error: error.message });
            }
        }
    }

    async login(req, res) {
        try {
            const data = req.body;
    
            const result = await loginUsuario(data);
            return res.status(result.status).json(result);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async obterInformacoesUsuarioPeloToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1]; // Obtém o token do cabeçalho de autorização
    
            if (!token) {
                return res.status(401).json({ error: 'Token não fornecido' });
            }
    
            const usuario = await obterInformacoesUsuario(token);
    
            if (!usuario) {
                return res.status(401).json({ error: 'Token inválido ou expirado' });
            }
    
            return res.json(usuario);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async logout(req, res) {
        try {
            const id = req.params.id;
    
            const mensagem = await logoutUsuario(parseInt(id));
            return res.status(200).json({ message: mensagem });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new UsuarioController();