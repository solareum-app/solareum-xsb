import { Router } from "express";
import MissionController from "./MissionController";

const router = Router();

router.post("/check", MissionController.check);
router.post("/get", MissionController.get);

export default router;
