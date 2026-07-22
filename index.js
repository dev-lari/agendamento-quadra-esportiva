import "dotenv/config";
import express, { response } from "express";
import prismaClient from "./database/PrismaClient.js";

const app = express();
app.use(express.json());
app.use(router)

app.use(players);


app.listen(3000, () => {
    console.log("Server running")
})