import { Router } from "express";
import { MedidaController } from "../controllers";

const routes = Router();

routes.get("/listar", MedidaController.listarTodasMedidas);

export default routes;