const loginRouter = require("express").Router()
const { PrismaClient } = require("@prisma/client")
// const authguard = require("../services/authguard")
const bcrypt = require("bcrypt")

const prisma = new PrismaClient()

loginRouter.get("/login", async(req, res) => {
        res.render("pages/login.twig", { current_page: 'login' });  
});

loginRouter.post("/login", async (req,res)=>{
    try {
        const entreprise = await prisma.entreprise.findUnique({
            where: { siret: req.body.siret }
        })
        if(entreprise){
            if(await bcrypt.compare(req.body.password, entreprise.password)) {
                req.session.entreprise = entreprise
                res.redirect("/")
            }
            else{
                throw {password: "Mot de passe incorrect"}
            }
        }else{
            throw{
                siret: "Siret inexistant"
            }
        }
    } catch (error) {
        console.log(error);
        res.render("pages/login.twig",{
            error,
            current_page: 'login'
        });
    }
});



module.exports = loginRouter