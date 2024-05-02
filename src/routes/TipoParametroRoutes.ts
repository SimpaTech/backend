import { Router } from "express";
import { TipoParametroController } from "../controllers";

const routes = Router();

routes.post("/cadastrarTipoParametro", TipoParametroController.cadastrarTipoParametro);
routes.get("/", TipoParametroController.listarTipoParametro);
routes.get("/buscarTipoParametro/:id", TipoParametroController.buscarTipoParametro);
routes.get("/filtrarTipoParametro", TipoParametroController.filtrarTipoParametro);
routes.put("/:id", TipoParametroController.editarTipoParametro);
routes.delete("/:id", TipoParametroController.removerTipoParametro);
routes.get("/listarAtivos", TipoParametroController.listarTiposParametroAtivos);
routes.put("/alterarIndicativo/:id", TipoParametroController.alterarIndicativo);

export default routes;