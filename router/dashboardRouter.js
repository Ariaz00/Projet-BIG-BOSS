const dashboardRouter = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const authguard = require("../services/authguard")

const prisma = new PrismaClient()

dashboardRouter.get("/", authguard, async(req, res) => {
    try {
        const entrepriseId = req.session.entreprise.id;
        const employes = await prisma.employe.findMany({
            where:{
                entrepriseId: entrepriseId
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                mail: true,
                age: true,
                blames: true,
                ordinateur: true
            }
        });
        const ordinateurs = await prisma.ordinateur.findMany({
            where: {
                entrepriseId: entrepriseId
            },
            include:{
                employe:true
            }
        });

        //couleur et statut
        const employesWithStatus = employes.map(employe => ({
            ...employe,
            color: 
                employe.blames === 0 ? 'green' :
                employe.blames === 1 ? '#f0c808' :
                employe.blames === 2 ? 'orange' : 'red',
            status: employe.blames >= 3 ? '(viré)' : ''
        }));

        res.render("pages/dashboard.twig", { employes: employesWithStatus,ordinateurs, title: "Dashboard" });
    } catch (error) {
        console.log("Erreur lors de la récupération des employés", error);
        res.render("pages/dashboard.twig", { error: error.message, title: "Dashboard"});
    }
})

module.exports = dashboardRouter