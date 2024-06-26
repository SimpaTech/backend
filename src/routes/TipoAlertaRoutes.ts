import { Router } from "express";
import { TipoAlertaController } from "../controllers";

const routes = Router();

routes.post("/criar", TipoAlertaController.criarTipoAlerta);
routes.put("/editar/:id", TipoAlertaController.editarTipoAlerta);
routes.delete("/deletar/:id", TipoAlertaController.removerTipoAlerta);
routes.get("/listar/:id", TipoAlertaController.listarTipoAlertaPorID);
routes.get("/listar", TipoAlertaController.listarTodosTipoAlerta);
routes.get("/listarPorCampo", TipoAlertaController.filtrarTipoAlerta);
routes.get("/listarAtivos", TipoAlertaController.listarTiposAlertaAtivos);
routes.put("/alterarIndicativo/:id", TipoAlertaController.alterarIndicativo);

export default routes;