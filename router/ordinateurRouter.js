const ordinateurRouter = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const authguard = require("../services/authguard");

const prisma = new PrismaClient();

ordinateurRouter.get("/ordinateur", authguard, async(req,res)=>{
    try {
        const entrepriseId = req.session.entreprise.id;
        const employesDisponibles = await prisma.employe.findMany({
            where:{
                entrepriseId: entrepriseId,
                ordinateur : null
            }
        });
        res.render("pages/addComputer.twig", { employesDisponibles, entrepriseId })
    } catch (error) {
        console.log("Erreur lors du chargement des employés", error);
        res.redirect("/dashboard");
    }
});

ordinateurRouter.post("/ordinateur", authguard, async(req, res)=>{
    try {
        const { mac, employeId, entrepriseId} = req.body;
        const existingOrdinateur = await prisma.ordinateur.findUnique({
            where: { mac }
        });
        if(existingOrdinateur){
            throw new Error("Cette adresse mac est déjà utilisée");
        }
        const ordinateur = await prisma.ordinateur.create({
            data:{
                mac: mac,
                employe: employeId ? {connect: { id: parseInt(employeId, 10)}} : undefined,
                entreprise: {connect: {id:parseInt(entrepriseId,10)}}
            }
        });
        console.log("Ordinateur ajouté avec succès", ordinateur);
        res.redirect("/")
    } catch (error) {
        console.log("Erreur lors de l'ajout de l'ordinateur", error);
        res.render("pages/addComputer.twig", {error: error.message, title: "Ajouter un ordinateur"});
    }
});

ordinateurRouter.post("/ordinateur/assigner/:id", authguard, async(req, res) => {
    try {
        const ordinateurId = parseInt(req.params.id, 10);
        const employeId = parseInt(req.body.employeId, 10);

        if (isNaN(employeId)) {
            throw new Error("ID d'employé invalide");
        }

        await prisma.ordinateur.update({
            where: { id: ordinateurId },
            data: { 
                employe: { connect: { id: employeId } }
            }
        });

        res.redirect("/");
    } catch (error) {
        console.log("Erreur lors de l'assignation de l'ordinateur", error);
        res.redirect("/");
    }
});

ordinateurRouter.post("/ordinateur/desassigner/:id", authguard, async(req, res) => {
    try {
        const ordinateurId = parseInt(req.params.id, 10);

        await prisma.ordinateur.update({
            where: { id: ordinateurId },
            data: { employeId: null }
        });

        res.redirect("/");
    } catch (error) {
        console.log("Erreur lors de la désassignation de l'ordinateur", error);
        res.redirect("/");
    }
});

ordinateurRouter.post("/ordinateur/supprimer/:id", authguard, async(req, res) => {
    try {
        const ordinateurId = parseInt(req.params.id, 10);

        await prisma.ordinateur.delete({
            where: { id: ordinateurId }
        });

        res.redirect("/");
    } catch (error) {
        console.log("Erreur lors de la suppression de l'ordinateur", error);
        res.redirect("/");
    }
});

module.exports = ordinateurRouter;