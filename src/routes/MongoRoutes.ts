import { Router } from "express";
import { MongoController } from "../controllers";

const routes = Router();

routes.post("/salvarMedida", MongoController.salvarMedida);

export default routes;