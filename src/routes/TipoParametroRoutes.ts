import { Router } from "express";
import { TipoParametroController } from "../controllers";

const routes = Router();

routes.post("/cadastrarTipoParametro", TipoParametroController.cadastrarTipoParametro);

export default routes;