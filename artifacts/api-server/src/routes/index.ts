import { Router, type IRouter } from "express";
import healthRouter from "./health";
import coinRouter from "./coin";
import revenuecatRouter from "./revenuecat";
import premiumRouter from "./premium";

const router: IRouter = Router();

router.use(healthRouter);
router.use(coinRouter);
router.use(revenuecatRouter);
router.use(premiumRouter);

export default router;
