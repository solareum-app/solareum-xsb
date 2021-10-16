import { Router } from "express";
import AirdropController from "./AirdropController";

const router = Router();

router.get("/check", AirdropController.check);
router.get("/get", AirdropController.get);

export default router;
