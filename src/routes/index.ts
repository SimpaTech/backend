import { Router } from "express";

import { default as UsuarioRoutes } from "./UsuarioRoutes";
import { default as EstacaoRoutes } from "./EstacaoRoutes";
import { default as TipoAlertaRoutes }from "./TipoAlertaRoutes";
import { default as TipoParametroRoutes }from "./TipoParametroRoutes";

const router = Router();

router.use("/usuario", UsuarioRoutes);
router.use("/estacao", EstacaoRoutes);
router.use("/tipoAlerta", TipoAlertaRoutes);
router.use("/tipoParametro", TipoParametroRoutes);

export default router;