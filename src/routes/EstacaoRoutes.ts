import { Router } from "express";
import { EstacaoController } from "../controllers";

const routes = Router();

routes.post("/criar", EstacaoController.criarEstacao);
routes.put("/editar/:id", EstacaoController.editarEstacao);

export default routes;