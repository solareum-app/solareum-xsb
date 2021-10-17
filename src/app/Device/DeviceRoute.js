import { Router } from "express";
import DeviceController from "./DeviceController";

const router = Router();

router.post("/register", DeviceController.register);

export default router;
