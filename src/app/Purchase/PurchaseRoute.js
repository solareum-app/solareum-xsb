import { Router } from "express";
import PurchaseController from "./PurchaseController";

const router = Router();

router.post("/verify", PurchaseController.verify);
router.post("/submit", PurchaseController.submit);
router.post("/distribute", PurchaseController.distribute);

export default router;
