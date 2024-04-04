import { Usuario } from "../entities/Usuario";
import SqlDataSource from "../data-source";
const bcrypt = require('bcryptjs')

async function adicionarUsuario(Nome_Usuario: string, CPF_Usuario: string, Role: string, Senha: string): Promise<Usuario> {
    const usuarioRepository = SqlDataSource.getRepository(Usuario)

    const senhaCriptografada = bcrypt.hashSync(Senha, 10);

    const usuario = new Usuario();
    usuario.Nome_Usuario = Nome_Usuario;
    usuario.CPF_Usuario = CPF_Usuario;
    usuario.Role = Role;
    usuario.Senha = senhaCriptografada;

    return await usuarioRepository.save(usuario);
}

async function listarTodosUsuarios() {
    const usuarioRepository = SqlDataSource.getRepository(Usuario);
    return await usuarioRepository.find();
}

async function procurarUsuario(CPF_Usuario) {
    const usuarioRepository = SqlDataSource.getRepository(Usuario);
    return await usuarioRepository.findOne({ where: { CPF_Usuario } });
}

async function procurarUsuarioPorId(id) {
    const usuarioRepository = SqlDataSource.getRepository(Usuario);
    return await usuarioRepository.findOne({ where: { ID_Usuario: id } })
}

async function atualizarUsuario(id, data) {
    const usuarioRepository = SqlDataSource.getRepository(Usuario)
    const usuario = await usuarioRepository.findOne({ where: { ID_Usuario: id } });

    if (!usuario) {
        throw new Error("Usuário não encontrado!");
    }

    if (data.Nome_Usuario !== undefined && data.Nome_Usuario !== "") {
        usuario.Nome_Usuario = data.Nome_Usuario;
    }

    if (data.Role !== undefined) {
        usuario.Role = data.Role;
    }

    if (data.Senha !== undefined) {
        const senhaCriptografada = bcrypt.hashSync(data.Senha, 10);
        usuario.Senha = senhaCriptografada;
    }

    await usuario.save();

    return usuario;
    
}

async function deletarUsuario(id) {
    const usuarioRepository = SqlDataSource.getRepository(Usuario)
    const usuario = await usuarioRepository.findOne({ where: { ID_Usuario: id } })

    if (!usuario) {
        throw new Error("Usuário não encontrado!");
    }

    const remocaoUsuario = await usuarioRepository.delete(id);
    return remocaoUsuario;
}

export { adicionarUsuario, listarTodosUsuarios, procurarUsuario, procurarUsuarioPorId, atualizarUsuario, deletarUsuario };