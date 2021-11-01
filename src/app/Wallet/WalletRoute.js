import { Router } from "express";
import WalletController from "./WalletController";

const router = Router();

router.post("/new", WalletController.new);
router.post("/update", WalletController.update);

export default router;
