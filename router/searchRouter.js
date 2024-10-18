const searchRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const authguard = require("../services/authguard");

const prisma = new PrismaClient();

searchRouter.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        const entrepriseId = req.session.entreprise.id;

        console.log("Recherche effectuée :", query);
        console.log("ID de l'entreprise :", entrepriseId);

        const employes = await prisma.employe.findMany({
            where: {
                entrepriseId: entrepriseId,
                OR: [
                    { firstName: { contains: query.toLowerCase() } },
                    { lastName: { contains: query.toLowerCase() } },
                    { mail: { contains: query.toLowerCase() } }
                ]
            }
        });
        
        const ordinateurs = await prisma.ordinateur.findMany({
            where: {
                entrepriseId: entrepriseId,
                mac: { contains: query.toLowerCase() }
            },
            include: { employe: true }
        });
        console.log("Employés trouvés :", employes.length);
        console.log("Ordinateurs trouvés :", ordinateurs.length);

        res.render("pages/searchResults.twig", { 
            employes, 
            ordinateurs, 
            query,
            title: "Résultats de recherche" 
        });
    } catch (error) {
        console.log("Erreur lors de la recherche", error);
        res.status(500).send("Erreur lors de la recherche : " + error.message);
    }
});

module.exports = searchRouter;