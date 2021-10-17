import { Router } from "express";
import AirdropController from "./AirdropController";

const router = Router();

router.post("/check", AirdropController.check);
router.post("/get", AirdropController.get);

export default router;
