import { Router } from "express";
import { TipoParametroController } from "../controllers";

const routes = Router();

routes.post("/cadastrarTipoParametro", TipoParametroController.cadastrarTipoParametro);
routes.get("/", TipoParametroController.listarTipoParametro);
routes.get("/buscarTipoParametro/:id", TipoParametroController.buscarTipoParametro);
routes.get("/filtrarTipoParametro", TipoParametroController.filtrarTipoParametro);

export default routes;