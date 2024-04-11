import { Router } from "express";
import { ParametroAlertaController } from "../controllers";

const routes = Router();

routes.post("/criar", ParametroAlertaController.criarParametroAlerta);
routes.put("/editar/:id", ParametroAlertaController.editarParametroAlerta);
routes.delete("/deletar/:id", ParametroAlertaController.removerParametroAlerta);
routes.get("/listar", ParametroAlertaController.listarTodosParametrosAlerta);

export default routes;