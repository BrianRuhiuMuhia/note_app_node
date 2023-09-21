const {db}=require("../database/database.js")
const {render}=require("ejs")
const {createJsonWebToken,maxLifeSpan,hashPassword,unHashPassword}=require("../utils/util.js")
let token=undefined;
let currentUser={}
function getNavPage(req,res)
{
return res.render("./home.ejs")
}
function getAllNotes(req,res)
{
db.query("select * from notes where user_id = $1 ",[currentUser.id],(err,result)=>{
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
function addNotePage(req,res)
{
return res.render("./addNote.ejs")
}
function addNote(req,res)
{
    const {text}=req.body
    db.query("insert into notes(user_text,user_id) values($1,$2)",[text,currentUser.id])
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
return res.render("login.html")
}
function registerPage(req,res)
{
return res.render("register.ejs")
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
            
               if(email == user.email&&unHashPassword(password,user.password))
               {
            currentUser=user
             token=createJsonWebToken(user.id)
             res.cookie('jwt',token, { maxAge: maxLifeSpan});
                return res.send({redirect:"/home.ejs"})
               }
               
            }
            else{
                return res.send({redirect:"/register.ejs"})
            }
    }
})
}
function register(req,res)
{
    const {name,email,password,confirmPassword}=req.body
    if(!name || !email || !password || !confirmPassword)
    {
        return res.json({"mssg":"fill all fields"})
    }
const hashedUserPassword=undefined;
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
                if(password != confirmPassword)
                {
                    return res.json({"mssg":"passwords don't match"})
                }
                const hashedUserPassword=hashPassword(password)
                db.query("insert into users(first_name,last_name,email,user_password) values($1,$2,$3,$4)",[names[0],names[1],email,hashedUserPassword])
                return res.send({redirect:"/login.html"})            }
        }
    })
}
function logout(req,res)
{
    res.cookie("jwt",token,{maxAge:0})
    currentUser={}
    return res.send("/home.html")
}
module.exports={getAllNotes,addNote,deleteNote,loginPage,registerPage,register,login,logout,addNotePage,getNavPage}