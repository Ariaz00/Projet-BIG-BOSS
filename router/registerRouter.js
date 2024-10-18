const registerRouter = require("express").Router()
const { PrismaClient } = require("@prisma/client")
const hashPasswordExtension = require("../services/extensions/hashPasswordExtension")
const bcrypt = require("bcrypt")

const prisma = new PrismaClient().$extends(hashPasswordExtension)

registerRouter.get("/register", (req, res) => {
    res.render("pages/register.twig", { current_page: 'register'});
});

registerRouter.post("/register", async (req, res) => {
    try {
        if (req.body.password === req.body.confirm_password) {
            const existingEntreprise = await prisma.entreprise.findUnique({
                where: {
                    siret: req.body.siret
                }
            });
            if(existingEntreprise){
                throw new Error ("Le siret est déjà utilisé");
            }

            const entreprise  = await prisma.entreprise.create({
                data: {
                    raisonSociale: req.body.raisonSociale,
                    siret: req.body.siret,
                    password: req.body.password
                }
            });
            console.log("entreprise créee avec succès", entreprise);   
            return res.redirect("/")
        } else {
            throw new Error("Vos mdp ne correspondent pas");
        } 
    }
    catch (error) {
        console.log(error)
        return res.render("pages/register.twig", { error: error, title: "Inscription" })
    }
})

module.exports = registerRouter