import express, { response, Router } from "express";
import { ScheduleController } from "../controllers/ScheduleController.js";

const router = Router();

const scheduleController = new ScheduleController() 

router.get("/reservas", scheduleController.getSchedule)
router.post("/reserva", scheduleController.postSchedule)
router.put("/reserva/:id", scheduleController.putSchedule)
router.delete("/reserva/:id", scheduleController.deleteSchedule)

export default router