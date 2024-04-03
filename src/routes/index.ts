import { Router } from "express";

import { default as EstacaoRoutes } from "./estacao";

const router = Router();

router.use("/estacao", EstacaoRoutes);

export default router;