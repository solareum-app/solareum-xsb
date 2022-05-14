import { Router } from "express";
import MissionController from "./MissionController";

const router = Router();

router.post("/check", MissionController.check);
router.post("/get", MissionController.get);
router.post("/distribute", MissionController.distribute);

export default router;
