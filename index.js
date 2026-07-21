import express, { response } from "express";
import prismaClient from "./database/PrismaClient.js";

const app = express();
app.use(express.json());

app.get("/players", async (request, response) => {
    const players = await prismaClient.player.findMany();
    return response.status(200).json(players);
})

app.get("/reservas", async (request, response) => {
    try {
        const schedule = await prismaClient.schedule.findMany({
            orderBy: {
                start_time: "asc"
            },
            select: { id: true, player_id: true, court_id:true, start_time: true, end_time: true},

        });
        return response.status(200).json(schedule);
    } catch(error) {
        console.log(error)
        return response.status(500).json({"error": error});
    }
})

async function hasScheduleConflict(court_id,start_time, end_time) {
    const schedule = await prismaClient.schedule.findFirst({
        where: {
            court_id: court_id,
            start_time: {
                lt: end_time
            },
            end_time: {
                gt: start_time
            }
        }
    });

    return schedule !== null;
}

function hassErrorDate(date_start, date_end) {
    if (date_end <= date_start) {
        return {
            error: "A data de fim deve ser maior que a inicial."
        };
    }

    if (date_start < new Date().getTime()) {
        return {
            error: "Essa data já passou."
        };
    }

    return null
}

app.post("/reserva", async (request, response) => {
    const { player_id, court_id, data, start_time, end_time} = request.body;
    try {
        var start_date = new Date(start_time).getTime()
        var end_date = new Date (end_time).getTime()

        const hasError =  hassErrorDate(start_date, end_date)

        if (hasError != null)
            return response.json(hasError)

        const scheduleExist = await hasScheduleConflict(court_id, start_time, end_time)

        if (!scheduleExist) {
            const schedule = await prismaClient.schedule.create({
                data: {
                    player_id,
                    court_id,
                    //data: data,
                    start_time: new Date(start_time),
                    end_time: new Date(end_time)
                },
                select: { id: true}
            })
            return response.status(201).json(schedule);
        }

        else{
            return response.json({"error": "Já existe agendamentos entre os horários escolhido!"});
        }
    } catch(error) {
        console.log(error)
        return response.status(500).json({"error": error});
    }
})

app.put("/reserva/:id", async (request, response) => {
    const { player_id, court_id, data, start_time, end_time, observacao} = request.body;

    const { id } = request.params;
    try {
        var start_date = new Date(start_time).getTime()
        var end_date = new Date(end_time).getTime()

        const hasError =  hassErrorDate(start_date, end_date)

        if (hasError != null)
            return response.json(hasError)

        const hasSchedule = await prismaClient.schedule.findFirst({
            where: {
                id: {
                    not: id
                },
                court_id: court_id,
                start_time: {
                    lt: end_time
                },
                end_time: {
                    gt: start_time
                }
            }
        });

        if (hasSchedule)
            return response.json({error: "Já existe agendamentos entre os horários escolhido!"});

        const scheduleExist = await prismaClient.schedule.findUnique({ where: { id } })

        if (!scheduleExist) {
            return response.status(404).json({error: "schedule not found"});
        }

        const schedule = await prismaClient.schedule.update({
            data: {
                player_id,
                court_id,
                //data: new Date(),
                start_time: new Date(start_time),
                end_time: new Date(end_time),
                //observacao: observacao
            },
            where: { id }
        })

        return response.status(200).json(schedule);
    } catch(error) {
        console.log(error)
        return response.status(500).json({"error": error});
    }
})

app.delete("/reserva/:id", async (request, response) => {
    const { id } = request.params;
    try {
        const scheduleExist = await prismaClient.schedule.findUnique({ where: { id } })

        if (!scheduleExist) {
            return response.status(404).json({error: "schedule not found"});
        }

        const schedule = await prismaClient.schedule.delete({ where: { id }});

        return response.status(204).send();
    } catch(error) {
        return response.status(500).json({"error": error});
    }
})

app.listen(3000, () => {
    console.log("Server running")
})