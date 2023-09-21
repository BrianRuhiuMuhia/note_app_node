const express=require("express")
const path=require("path")
const app=express()
const {routes}=require("./routes/routes.js")
const dotenv=require("dotenv")
const cookieParser=require("cookie-parser")
const ejs=require("ejs")
dotenv.config()
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static("public"))
app.use("/",routes)

app.all("*",function(req,res)
{
return res.status(404).send("<h1>Page Not Found</h1>")
})
app.listen(process.env.PORT,()=>{
    console.log(`server running on port ${process.env.PORT}`)
})