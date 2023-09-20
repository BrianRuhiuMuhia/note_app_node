const express=require("express")
const routes=express.Router()
const {getAllNotes,addNote,deleteNote, loginPage, registerPage,register,login,logout
,}=require("../controllers/controllers.js")
routes.get("/allNotes",getAllNotes)
routes.post("/addNotes",addNote)
routes.delete("/:id",deleteNote)
routes.get("/login",loginPage)
routes.get("/register",registerPage)
routes.post("/register",register)
routes.post("/login",login)
routes.get("/logout",logout)
module.exports={routes}