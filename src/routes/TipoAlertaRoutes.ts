import { Router } from "express";
import { TipoAlertaController } from "../controllers";

const routes = Router();

routes.post("/criar", TipoAlertaController.criarTipoAlerta);
routes.put("/editar/:id", TipoAlertaController.editarTipoAlerta);
routes.delete("/deletar/:id", TipoAlertaController.removerTipoAlerta);

export default routes;