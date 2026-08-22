import express, { response, Router } from "express";
import { ScheduleController } from "../controllers/ScheduleController.js";
import { CourtController} from "../controllers/CourtController.js";

const router = Router();

const scheduleController = new ScheduleController() 
const courtController = new CourtController()

// schedule routes
router.get("/reservas", scheduleController.getSchedule)
router.get("/reservas/:id", scheduleController.getById)
router.post("/reserva", scheduleController.postSchedule)
router.put("/reserva/:id", scheduleController.putSchedule)
router.delete("/reserva/:id", scheduleController.deleteSchedule)

// court routes
router.get("/quadras", courtController.getCourt)
router.post("/quadras", courtController.postCourt)
router.put("/quadras/:id", courtController.putCourt)
router.delete("/quadras/:id", courtController.deleteCourt)

export default router