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
    try {
        const players = await prismaClient.player.create ({
        data: {name, email, phone}
        })

        return response.status(201).json(players)

    } catch (error) {
        return response.status(500).json({error: error})
    }
    })

router.put("/players/:id", async (request, response) => {
    const {name, email, phone} = request.body
    const {id} = request.params

    const playerExist = await prismaClient.player.findUnique({where: {id} })

    if (!playerExist) {
        return response.status(404).json({error: "Jogador não encontrado!"})
    }

    const player = await prismaClient.player.update({
        data: {name, email, phone}, 
        where: {id}
    })

    return response.status(200).json(player);
})

router.delete("/players/:id", async (request, response) => {
    const { id } = request.params

    const playerExist = await prismaClient.player.findUnique({where: {id}})


    if (!playerExist) {
        return response.status(404).json({error: "Jogador não existe!"})
    }

    await prismaClient.player.delete({where: {id}})

    return response.status(204).send();
})

export default router