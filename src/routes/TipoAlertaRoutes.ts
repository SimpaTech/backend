import { Router } from "express";
import { TipoAlertaController } from "../controllers";

const routes = Router();

routes.post("/criar", TipoAlertaController.criarTipoAlerta);

export default routes;