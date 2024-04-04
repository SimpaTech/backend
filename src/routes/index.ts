import { Router } from "express";

import { default as UsuarioRoutes } from "./UsuarioRoutes";
import { default as EstacaoRoutes } from "./EstacaoRoutes";

const router = Router();

router.use("/usuario", UsuarioRoutes);
router.use("/estacao", EstacaoRoutes);

export default router;