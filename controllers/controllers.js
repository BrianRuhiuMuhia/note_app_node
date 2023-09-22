const {db}=require("../database/database.js")
const {createJsonWebToken,maxLifeSpan,hashPassword,unHashPassword, removeCookie}=require("../utils/util.js")
let token=undefined;
let currentUser={}
function getNavPage(req,res)
{
return res.render("./home")
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
        const data={
            user:currentUser,
            result:result.rows,
            page:"./home.ejs"
        }
return res.json(data)
    }
})
}
function addNotePage(req,res)
{
return res.render("./addNote")
}
function addNote(req,res)
{

    const {text}=req.body
    db.query("insert into notes(user_text,user_id) values($1,$2)",[text,currentUser.id])
    return res.send({"route":"./home"})
}
function deleteNote(req,res)
{
    const {id}=req.params
    db.query("delete from notes where id = $1",[id])
    return res.redirect("/")
}
function loginPage(req,res)
{
    if(token && currentUser!=null)
    {
        return res.render("./home")
    }
return res.render("./login")
}
function registerPage(req,res)
{
return res.render("./register")
}
function login(req,res)
{
    if(token && currentUser!=null)
    {
        token=undefined
        currentUser={}
        return res.send({"route":"./"})
    }
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
                password:result.rows[0].user_password,
                name:result.rows[0].name
               }
            
               if(email == user.email&&unHashPassword(password,user.password))
               {
            currentUser=user
             token=createJsonWebToken(user.id)
             res.cookie('jwt',token, { maxAge: maxLifeSpan});
                return res.send({"route":"./addNote"})
               }
               else{
                return res.json({"err":"wrong password"})
               }
               
            }
            else{
                return res.send({"route":"./register"})
            }
    }
})
}
function register(req,res)
{
    if(token)
    {
        token=undefined
        removeCookie("jwt",res)
    }
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
                return res.json({"route":"./"})
            }
            else{
                
                if(password != confirmPassword)
                {
                    return res.json({"mssg":"passwords don't match"})
                }
                const hashedUserPassword=hashPassword(password)
                db.query("insert into users(name,email,user_password) values($1,$2,$3)",[name,email,hashedUserPassword])
                return res.json({"route":"./"})           }
        }
    })
}
function logout(req,res)
{
   removeCookie("jwt",res,token)
   token=undefined
    currentUser={}
    return res.render("./login")
}
module.exports={getAllNotes,addNote,deleteNote,loginPage,registerPage,register,login,logout,addNotePage,getNavPage}