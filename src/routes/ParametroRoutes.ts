import { Router } from "express";
import { ParametroController } from "../controllers";

const routes = Router();

routes.post("/criar", ParametroController.criarParametro);
routes.put("/editar/:id", ParametroController.editarParametro);
routes.delete("/deletar/:id", ParametroController.removerParametro);
routes.get("/listar", ParametroController.listarTodosParametros);

export default routes;