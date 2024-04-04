import { Router } from "express";
import  UsuarioController  from '../controllers/UsuarioController';

const routes = Router();

routes.post("/cadastrarUsuario", UsuarioController.cadastrarUsuario)
routes.get("/", UsuarioController.listarUsuarios)
routes.get("/buscarUsuario", UsuarioController.buscarUsuario)
routes.get("/buscarUsuario/:id", UsuarioController.buscarUsuarioPorId)
routes.put("/:id", UsuarioController.editarUsuario)
routes.delete("/:id", UsuarioController.removerUsuario)
routes.post("/login", UsuarioController.login)
routes.get("/informacoesToken", UsuarioController.obterInformacoesUsuarioPeloToken)
routes.post("/logout/:id", UsuarioController.logout);

export default routes;
