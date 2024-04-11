import { Router } from "express";
import { OcorenciasController } from "../controllers";
import OcorrenciasController from "../controllers/OcorrenciasController";

const routes = Router();

routes.post("/criar", OcorenciasController.criarOcorrencia);
routes.put("/editar/:id", OcorrenciasController.editarOcorrencia);
routes.delete("/deletar/:id", OcorrenciasController.removerOcorrencia);
routes.get("/listar", OcorenciasController.listarTodasOcorrencias);

export default routes;