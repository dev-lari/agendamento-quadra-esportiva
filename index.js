import express, { response } from "express";
import prismaClient from "./database/PrismaClient.js";
import router from "./src/routes/index.js";

const app = express();
app.use(express.json());
app.use(router)

app.get("/players", async (request, response) => {
    const players = await prismaClient.player.findMany();
    return response.status(200).json(players);
})

app.listen(3000, () => {
    console.log("Server running")
})