import prismaClient from "../../database/PrismaClient.js";

export class CourtController {

    async getCourt (req, res) {
        try {
        const court = await prismaClient.court.findMany({})
        return res.status(200).json(court);
        } catch (error) {
            console.log("erro ao buscar quadras", error);
        return res.status(500).json({"error": error});
        }
    }

    async postCourt (req, res) {
        const {name, sport, location} = req.body;

        try {
            const court = await prismaClient.court.create({
                data: {
                    name,
                    sport,
                    location
                }
            })
            return res.status(201).json(court);
        }catch (error) {
             console.log(error)
        
            return res.status(500).json({"error": error});
        }
    }

    async putCourt (req, res) {

        const { name, sport, location} = req.body; 
        const { id} = req.params;

        try {
        const courtExist = await prismaClient.court.findUnique ({ where: { id } })
        
        if (!courtExist) {
            return res.status(404).json({error: "Quadra não encontrada"});
        }

            const court = await prismaClient.court.update({
                data: {
                    name,
                    sport,
                    location
                },
                where: { id}
            })

            return res.status(200).json(court);

        } catch (error) {
            console.log(error)
            return res.status(500).json({"error": error});
        }
    }

    async deleteCourt (req, res) {
        
        const { id } = req.params;

        try {
            const courtExist = await prismaClient.court.findUnique ({where: { id } })

            if (!courtExist) {
                return res.status(404).json({error: "Quadra não encontrada"});
            }

            const hasSchedule = await prismaClient.schedule.findFirst({where: {court_id: id}})
            
            if (hasSchedule) {
                return res.status(400).json({error: "Não é possível deletar quadra com reservas associadas"});
            }
            await prismaClient.court.delete({where: { id }})
            return res.status(204).send();
        } catch (error) {
            console.log(error);
            return res.status(500).json({"error": error});
        }
    }
}