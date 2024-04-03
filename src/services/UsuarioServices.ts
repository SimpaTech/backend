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

export { adicionarUsuario, listarTodosUsuarios, procurarUsuario, procurarUsuarioPorId };