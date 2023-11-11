const express=require("express")
const path=require("path")
const app=express()
const bodyParser=require("body-parser")
const {routes}=require("./routes/routes.js")
const dotenv=require("dotenv")
const cookieParser=require("cookie-parser")
dotenv.config()
app.use(express.urlencoded({extended:false}))
app.use(express.json({limit: '50mb'}))
app.use(express.urlencoded({extended:false,limit: '50mb'}))
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