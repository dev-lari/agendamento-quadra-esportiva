import express from "express";
import prismaClient from "./database/PrismaClient.js";
import router from "./src/routes/index.js";

const app = express();
app.use(express.json());
app.use(router)

app.listen(3000, () => {
    console.log("Server running")
})