import { Router } from "express";
import PurchaseController from "./PurchaseController";

const router = Router();

router.post("/submit", PurchaseController.submit);

export default router;
