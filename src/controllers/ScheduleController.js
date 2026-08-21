import prismaClient from "../../database/PrismaClient.js";

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

function hassErrorDate(date_start, date_end, player_id, court_id) {
    if (date_end <= date_start) {
        return {
            error: "A data de fim deve ser maior que a inicial."
        };
    }

    if (date_start < new Date()) {
        return {
            error: "Essa data já passou."
        };
    }

    if (player_id == null){
         return {
            error: "O jogador deve ser informado!"
        };
    }

    if (court_id == null){
         return {
            error: "A Quadra deve ser informada!"
        };
    }
    return null
}

export class ScheduleController {

    async getSchedule (request, response) {
        const { name, start_time, end_time } = request.query;
        const whereCondition = {};
        try {
            if (name) {
                whereCondition.player = {
                    name: {
                        contains: name,
                        mode: 'insensitive' // Ignora maiúsculas/minúsculas
                    }
                };
            }

            if (start_time || end_time) {
                whereCondition.start_time = {};
                whereCondition.end_time = {};

                if (start_time) {
                    // Converte a string da query em um objeto Date do JavaScript
                    whereCondition.start_time.gte = new Date(start_time);
                }

                if (end_time) {
                    // Converte a string da query em um objeto Date do JavaScript
                    whereCondition.end_time.lte = new Date(end_time);
                }
            }
            const schedule = await prismaClient.schedule.findMany({
                where: whereCondition,
                orderBy: {
                    start_time: "asc"
                },
                //select: { id: true, player_id: true, court_id:true, start_time: true, end_time: true},
                include: {
                    player: true,
                    court: true
                }
            });
            return response.status(200).json(schedule);
        } catch(error) {
            console.log(error)
            return response.status(500).json({"error": error});
        }
    }

    async getById (request, response) {
        const { id } = request.params;
        try {
            const scheduleExist = await prismaClient.schedule.findUnique(
            {   where: { id },
                include: {
                    player: true,
                    court: true
                } 
            },
            )
    
            if (!scheduleExist) {
                return response.status(404).json({error: "schedule not found"});
            }
    
            return response.status(200).send(scheduleExist);
        } catch(error) {
            return response.status(500).json({"error": error});
        }
    }

    async postSchedule (request, response) {
        const { player_id, court_id, start_time, end_time} = request.body;
        try {
            var start_date = new Date(start_time)
            var end_date = new Date (end_time)

            const hasError =  hassErrorDate(start_date, end_date, player_id, court_id)

            if (hasError != null)
                return response.json(hasError)

            const scheduleExist = await hasScheduleConflict(court_id, start_time, end_time)

            if (!scheduleExist) {
                const schedule = await prismaClient.schedule.create({
                    data: {
                        player_id,
                        court_id,
                        //create_at: new Date(),
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
    }

    async putSchedule(request, response) {
        const { player_id, court_id, start_time, end_time, observacao} = request.body;

        const { id } = request.params;
        try {
            var start_date = new Date(start_time)
            var end_date = new Date(end_time)

            const hasError =  hassErrorDate(start_date, end_date, player_id, court_id)

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
    }

    async deleteSchedule(request, response)  {
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
    }
}