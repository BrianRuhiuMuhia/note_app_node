const {db}=require("../database/database.js")
const {createJsonWebToken,maxLifeSpan}=require("../utils/util.js")
function getAllNotes(req,res)
{
db.query("select * from notes",(err,result)=>{
    if(err)
    {
        console.log(err)
        return res.json({"mssg":"error"})
    }
    else{
return res.json(result.rows)
    }
})
}
function addNote(req,res)
{
    const {text}=req.body
    const user={}
    db.query("select * from users where id=$1",[1],(err,result)=>{
    user.id=result.rows[0].id
    user.text=text
    db.query("insert into notes(user_text,user_id) values($1,$2)",[user.text,user.id])
    })
    return res.redirect("/")
}
function deleteNote(req,res)
{
    const {id}=req.params
    db.query("delete from notes where id = $1",[id])
    return res.redirect("/")
}
function loginPage(req,res)
{
return res.send("login.html")
}
function registerPage(req,res)
{
return res.send("register.html")
}
function login(req,res)
{
    const {name,email,password}=req.body
    if(!name || !email || !password)
    {
        return res.json({"mssg":"fill all fields"})
    }
    db.query("select * from users where email= $1",[email],(err,result)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            if(result.rows[0])
            {
               const user={
                id:result.rows[0].id,
                email:result.rows[0].email,
                password:result.rows[0].user_password
               }
               if(password!=user.password)
               {
                console.log("incorrect password")
               }
               if(email == user.email && password==user.password)
               {
                console.log(user)
                const token=createJsonWebToken(user.id)
                res.cookie("jwt",token,{maxAge:maxLifeSpan})
                return res.send("home.html")
               }
               
            }
            else{
                console.log("register")
            }
    }
})
}
function register(req,res)
{
    const {name,email,password,confirmPassword}=req.body
    console.log(req.body)
    if(!name || !email || !password || !confirmPassword)
    {
        return res.json({"mssg":"fill all fields"})
    }
    db.query("select * from users where email= $1",[email],(err,result)=>
    {
        if(err)
        {
            console.log(err)
        }
        else{
            if(result.rows[0])
            {
                return res.send({redirect:"/login.html"})
            }
            else{
                let names=name.split(" ")
                console.log(names)
                if(password != confirmPassword)
                {
                    return res.json({"mssg":"passwords don't match"})
                }
                db.query("insert into users(first_name,last_name,email,user_password) values($1,$2,$3,$4)",[names[0],names[1],email,password])
            }
        }
    })
}
function logout(req,res)
{
    res.cookie("jwt",token,{maxAge:0})
    return res.send("../public/home.html")
}
module.exports={getAllNotes,addNote,deleteNote,loginPage,registerPage,register,login,logout}