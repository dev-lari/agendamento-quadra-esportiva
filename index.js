import "dotenv/config";
import express, { response } from "express";
import prismaClient from "./database/PrismaClient.js";
import players from "./src/players.js"

const app = express();
app.use(express.json());

app.use(players);


app.listen(3000, () => {
    console.log("Server running")
})