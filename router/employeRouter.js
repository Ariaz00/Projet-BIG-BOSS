const employeRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const authguard = require("../services/authguard");

const prisma = new PrismaClient();

employeRouter.get("/employe", authguard, async(req, res) => {
    try {
        const entrepriseId = req.session.entreprise ? req.session.entreprise.id : null;
        res.render("pages/employe.twig", { entrepriseId });
    } catch (error) {
        console.log("Vous devez être connecté");
        res.redirect("/login");
    }
});

employeRouter.post("/employe", authguard, async(req, res) => {
    try {

        const entrepriseId = req.body.entrepriseId ? parseInt(req.body.entrepriseId, 10) : null;
        
        // Si l'ID de l'entreprise n'est pas fourni ou n'est pas un nombre, on lève une erreur
        if (!entrepriseId || isNaN(entrepriseId)) {
            throw new Error("Invalid entreprise ID");
        }

        const employe = await prisma.employe.create({
            data: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                mail: req.body.mail,
                password: req.body.password,
                age: req.body.age ? parseInt(req.body.age, 10) : null,  // Conversion de l'âge
                entreprise: {
                    connect: { id: entrepriseId }  // Utilisation de l'ID validé ici
                }
            }
        });

        console.log("Employé créé avec succès", employe);
        res.redirect("/");
    } catch (error) {
        console.log("Erreur lors de la création de l'employé :", error);
        res.render("pages/dashboard.twig", { error: error.message, title: "employé" });
    }
});

employeRouter.get("/employe/update/:id", authguard, async (req, res)=>{
    try {
        const employeId = parseInt(req.params.id, 10);
        const employe = await prisma.employe.findUnique({
            where: { id: employeId},
        });
        if(!employe){
            throw new Error("Employé non trouvé");
        }
        const entrepriseId = req.session.entreprise ? req.session.entreprise.id : null;
        res.render("pages/updateEmploye.twig", { employe, entrepriseId });
    } catch (error) {
        console.log("Erreur lors de la récupération de l'employé", error);
        res.redirect("/")
    }
})

employeRouter.post("/employe/update/:id", authguard, async(req, res)=>{
    try {
        const employeId = parseInt(req.params.id, 10);
        const employe = await prisma.employe.update({
            where: { id:employeId},
            data: {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                mail: req.body.mail,
                age: req.body.age ? parseInt(req.body.age, 10) : null,
            },
        });
        console.log("Employé mis à jour avec succès", employe);
        res.redirect("/")
    } catch (error) {
        console.log("Erreur lors de la mise à jour de l'employé", error);
        res.redirect("/")
    }
});

employeRouter.post("/employe/delete/:id", authguard, async (req, res) => {
    try {
        const employeId = parseInt(req.params.id, 10);

        // Supprimer d'abord les données liées, comme les logs de blâmes
        await prisma.blameLog.deleteMany({
            where: { employeId: employeId },
        });

        // Supprimer ensuite l'employé
        await prisma.employe.delete({
            where: { id: employeId },
        });

        console.log("Employé supprimé avec succès");
        res.redirect("/");
    } catch (error) {
        console.log("Erreur lors de la suppression de l'employé", error);
        res.redirect("/");
    }
});


employeRouter.get("/", authguard, async (req, res) => {
    try {
        const entrepriseId = req.session.entreprise.id;

        const employes = await prisma.employe.findMany({
            where: { entrepriseId: entrepriseId },
            include: { ordinateur: true, blameLog: true }  
        });

        const employesWithStatus = employes.map(employe => ({
            ...employe,
            color: 
                employe.blames === 0 ? 'green' :
                employe.blames === 1 ? 'yellow' :
                employe.blames === 2 ? 'orange' : 'red',
            status: employe.blames >= 3 ? '(viré)' : ''
        }));

        const ordinateurs = await prisma.ordinateur.findMany({
            where: { entrepriseId: entrepriseId },
            include: { employe: true }  
        });

        console.log('Employés avec statut', employesWithStatus);
        

        res.render("pages/dashboard.twig", { employes: employesWithStatus, ordinateurs, title: "Dashboard" });
    } catch (error) {
        console.log("Erreur lors du chargement du dashboard :", error);
        res.redirect("/login");
    }
});

employeRouter.post("/employe/addBlame/:id", authguard, async(req, res)=>{
    try {
        const employeId = parseInt(req.params.id);
        const { reason } = req.body;
        const employe = await prisma.employe.findUnique({
            where:{ id: employeId}
        });

        if(!employe){
            return res.status(404).send('Employé non trouvé');
        }
        const newBlameCount = employe.blames + 1;

        await prisma.employe.update({
            where:{ id: employeId },
            data: { blames: newBlameCount }
        });

        await prisma.blameLog.create({
            data: {
                employeId: employeId,
                reason: reason
            }
        });
        res.redirect('/');
    } catch (error) {
        console.error("Erreur lors de l'ajout du blâme", error);
        res.status(500).send("Erreur lors de l'ajout du blâme");
    }
});

module.exports = employeRouter;
