import { Router } from "express";
import { EstacaoController } from "../controllers";

const routes = Router();

routes.post("/criar", EstacaoController.criarEstacao);
routes.put("/editar/:id", EstacaoController.editarEstacao);
routes.delete("/deletar/:id", EstacaoController.removerEstacao);

export default routes;