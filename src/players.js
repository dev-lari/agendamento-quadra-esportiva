import express from "express";
import prismaClient from "../database/PrismaClient.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();

router.get("/players", async (request, response) => {
    const players = await prismaClient.player.findMany();
    return response.status(200).json(players);
})


router.get("/players/:id", async (request, response) => {
    const { id } = request.params;
    const player = await prismaClient.player.findUnique({ where: { id } });

    if (!player) {
        return response.status(404).json({ error: "Jogador não encontrado!" });
    }
    return response.status(200).json(player);
})


router.post("/players", async (request, response) => {
    const {name, email, phone} = request.body

    const emailExist = await prismaClient.player.findUnique({ where: { email } })

    if (emailExist) {
        return response.status(400).json({error: "Já existe um jogador cadastrado com esse e-mail!"});
    }

    const players = await prismaClient.player.create ({
        data: {name, email, phone}
        })
        return response.status(201).json(players)
    })

router.put("/players/:id", async (request, response) => {
    const {name, email, phone} = request.body
    const {id} = request.params

    const playerExist = await prismaClient.player.findUnique({where: {id} })

    if (!playerExist) {
        return response.status(404).json({error: "Jogador não encontrado!"})
    }

    const emailExist = await prismaClient.player.findFirst({
        where: {
            email,
            id: { not: id }
        }
    });

    if (emailExist) {
        return response.status(400).json({error: "Já existe um jogador cadastrado com esse email!"});
    }

    const player = await prismaClient.player.update({
        data: {name, email, phone}, 
        where: {id}
    })
    return response.status(200).json(player);
})

router.delete("/players/:id", async (request, response) => {
    const { id } = request.params;

    const playerExist = await prismaClient.player.findUnique({ where: { id } });

    if (!playerExist) {
        return response.status(404).json({ error: "Jogador não encontrado" });
    }

    const hasSchedule = await prismaClient.schedule.findFirst({ where: { player_id: id } });

    if (hasSchedule) {
        return response.status(400).json({error: "Não é possível excluir jogador com reservas associadas"});
    }

    await prismaClient.player.delete({ where: { id } });
    return response.status(204).send();
})


export default router;