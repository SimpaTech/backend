import { Router } from "express";
import  UsuarioController  from '../controllers/UsuarioController';

const routes = Router();

routes.post("/cadastrarUsuario", UsuarioController.cadastrarUsuario)

export default routes;
