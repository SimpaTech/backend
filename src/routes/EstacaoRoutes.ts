import { Router } from "express";
import { EstacaoController } from "../controllers";

const routes = Router();

routes.post("/criar", EstacaoController.criarEstacao);
routes.put("/editar/:id", EstacaoController.editarEstacao);
routes.delete("/deletar/:id", EstacaoController.removerEstacao);
routes.get("/listar/:id", EstacaoController.listarEstacaoPorID);
routes.get("/listar", EstacaoController.listarTodasEstacoes);

export default routes;