import { Usuario } from "../entities/Usuario";
import SqlDataSource from "../data-source";
const bcrypt = require('bcryptjs')
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

async function adicionarUsuario(Nome_Usuario: string, CPF_Usuario: string, Senha: string): Promise<Usuario> {
    const usuarioRepository = SqlDataSource.getRepository(Usuario)

    const senhaCriptografada = bcrypt.hashSync(Senha, 10);

    const role = '1'; // 1 = administrador

    const usuario = new Usuario();
    usuario.Nome_Usuario = Nome_Usuario;
    usuario.CPF_Usuario = CPF_Usuario;
    usuario.Role = role;
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

async function loginUsuario(data: { CPF_Usuario: string, Senha: string }) {

    if (!data.CPF_Usuario) {
        throw new Error("Por favor, digite seu CPF!");
    }
    if (!data.Senha) {
        throw new Error("Por favor, digite sua senha!");
    }

    const checarUsuario = await Usuario.findOne({ where: { CPF_Usuario: data.CPF_Usuario } });

    if (!checarUsuario) {
        throw new Error("Usuário não encontrado!");
    }

    // Verificar se a senha está correta
    const checarSenha = bcrypt.compareSync(data.Senha, checarUsuario.Senha);

    if (!checarSenha) {
        throw new Error("A senha digitada está inválida!");
    }

    // Gerar um identificador único para este token
    const tokenId = generateTokenId();

    // Gerar token JWT usando a chave secreta definida na variável de ambiente
    const token = jwt.sign(
        { id_usuario: checarUsuario.ID_Usuario, role: checarUsuario.Role, tokenId },
        process.env.JWT_SECRET!, // Usa a chave secreta definida na variável de ambiente
        { expiresIn: '15min' } // Tempo de expiração do token
    );

    // Atualizar o token no registro do usuário
    checarUsuario.Token = token;
    await checarUsuario.save();

    // Retorna os detalhes do usuário logado com o token
    return {
        message: "Login feito com sucesso!",
        status: 201,
        token,
        id_usuario: checarUsuario.ID_Usuario,
        nome: checarUsuario.Nome_Usuario,
        role: checarUsuario.Role,
        cpf: checarUsuario.CPF_Usuario
    };
}

async function logoutUsuario(id_usuario: number) {
    // Remover o token do registro do usuário
    const usuario = await Usuario.findOne({ where: { ID_Usuario: id_usuario } });
    if (usuario) {
        usuario.Token = '';
        await usuario.save();
    }
    return "Logout realizado com sucesso!";
}

function generateTokenId() {
    // Gere um identificador único usando um pacote de geração de UUID
    const uuid = require('uuid');
    return uuid.v4();
}

async function obterInformacoesUsuario(token) {
    try {
        if (!token) {
            throw new Error('Token não fornecido');
        }

        // Verifica se o token é válido e decodifica suas informações
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Verifica se as informações decodificadas incluem o ID do usuário
        if (!decoded.id_usuario) {
            throw new Error('Token inválido: ID do usuário não encontrado');
        }

        console.log(decoded)

        // Busca o usuário no banco de dados usando o ID decodificado
        const usuario = await Usuario.findOne({ where: { ID_Usuario: decoded.id_usuario } });

        if (!usuario) {
            throw new Error('Usuário não encontrado no banco de dados');
        }

        return usuario;
    } catch (error) {
        throw new Error('Erro ao obter informações do usuário: ' + error.message);
    }
}

export { adicionarUsuario, listarTodosUsuarios, procurarUsuario, procurarUsuarioPorId, atualizarUsuario, deletarUsuario, loginUsuario, obterInformacoesUsuario };