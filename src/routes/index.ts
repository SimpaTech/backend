import { Router } from "express";

import { default as UsuarioRoutes } from "./UsuarioRoutes";
import { default as EstacaoRoutes } from "./EstacaoRoutes";
import { default as TipoAlertaRoutes }from "./TipoAlertaRoutes";
import { default as TipoParametroRoutes }from "./TipoParametroRoutes";
import { default as ParametroAlertaRoutes } from "./ParametroAlertaRoutes";
import { default as OcorrenciasRoutes } from "./OcorrenciasRoutes";
import { default as ParametroRoutes } from "./ParametroRoutes";
import { default as MongoRoutes } from "./MongoRoutes"
import { default as MedidaRoutes } from "./MedidaRoutes"

const router = Router();

router.use("/usuario", UsuarioRoutes);
router.use("/estacao", EstacaoRoutes);
router.use("/tipoAlerta", TipoAlertaRoutes);
router.use("/tipoParametro", TipoParametroRoutes);
router.use("/parametroAlerta", ParametroAlertaRoutes);
router.use("/ocorrencias", OcorrenciasRoutes);
router.use("/parametro", ParametroRoutes);
router.use("/mongodb", MongoRoutes);
router.use("/medida", MedidaRoutes);

export default router;