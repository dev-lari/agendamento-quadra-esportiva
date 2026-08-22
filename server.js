import express, { response } from "express";

import players from "./src/players.js"
import router from "./src/routes/index.js";

import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors());

app.use(players);

app.use(router)

app.listen(3000, () => {
    console.log("Server running localhost:3000")
})