import { Router } from "express";
import { EstacaoController } from "../controllers";

const routes = Router();

routes.post("/criar", EstacaoController.criarEstacao);

export default routes;