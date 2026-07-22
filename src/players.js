import express from "express";
import prismaClient from "../database/PrismaClient.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

router.get("/players", async (request, response) => {
    const players = await prismaClient.player.findMany();
    return response.status(200).json(players);
})


router.post("/players", async (request, response) => {
    const {name, email, phone} = request.body
    const players = await prismaClient.player.create ({
        data: {name, email, phone}
    })
    return response.status(201).json(players)
})


export default router;