const express = require("express");
const session = require("express-session")
const loginRouter = require("./router/loginRouter")
const employeRouter = require("./router/employeRouter");
const registerRouter = require("./router/registerRouter");
const dashboardRouter = require("./router/dashboardRouter");
const logoutRouter = require("./router/logoutRouter");
const ordinateurRouter = require("./router/ordinateurRouter");
const searchRouter = require("./router/searchRouter");

const app = express(); // on lance le server
require("dotenv").config()
app.use(express.static("./public"))
app.use(express.urlencoded({extended:true})) // avant le router, on lit les contenus des forms
app.use(session({
    secret: "bsbdgnjdhdbnyegbkVCCCdjsh:_'(-665GVB",
    resave:true, // durée de vie ? tant qu'il fait des trucs sur le site ça le refresh
    saveUninitialized:true
}))

app.use(loginRouter)
app.use(employeRouter)
app.use(registerRouter)
app.use(dashboardRouter)
app.use(logoutRouter)
app.use(ordinateurRouter)
app.use(searchRouter)


app.listen(process.env.PORT, (err)=>{
    console.log("Connecté sur le port 3000");  
}) 