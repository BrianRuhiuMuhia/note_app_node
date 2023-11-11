const {db}=require("../database/database.js")
const fs=require("fs")
const {createJsonWebToken,maxLifeSpan,hashPassword,unHashPassword,deleteFile,removeCookie, generateRandomUserIds,createResetToken, sendEmail, createDirAndFile}=require("../utils/util.js")
let token=undefined;
let currentUser={}
function getNavPage(req,res)
{
return res.render("./home")
}
async function getAllNotes(req,res)
{
    try{
        await db.query("select * from notes where user_id = $1 ",[currentUser.id],(err,result)=>{
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
        return res.status(200).json(data)
            }
        })
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("<h1>500:server error</h1>")
    }

}
function addNotePage(req,res)
{
return res.render("./addNote")
}
async function addNote(req,res)
{

    const {title,text}=req.body
    try{
        await db.query("insert into notes(text,title,user_id) values($1,$2,$3)",[text,title,currentUser.id])
        return res.status(200).send({"route":"./home"})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("<h1>500:server error</h1>")

    }

}
function deleteNote(req,res)
{
    const {id}=req.params
    try{
        db.query("delete from notes where id = $1",[id])
        return res.status(204).send({"route":"./home"})
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("<h1>500:Server Error</h1>")
    }

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
async function login(req,res)
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
    try{
        await db.query("select * from users where email= $1",[email],(err,result)=>{
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
                    return res.status(302).send({"route":"./addNote"})
                   }
                   else{
                    return res.status(400).json({"err":"wrong password"})
                   }
                   
                }
                else{
                    return res.status(200).send({"route":"./register"})
                }
        }
    })
    }
    catch(err)
    {
        console.log(err)
        return res.status(500).send("<h1>500:Server Error</h1>")
    }
  
}
async function register(req,res)
{
    const id=generateRandomUserIds()
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
try{
    await db.query("select * from users where email= $1",[email],async (err,result)=>
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
            await db.query("insert into users(id,name,email,user_password) values($1,$2,$3,$4)",[id,name,email,hashedUserPassword])
                return res.json({"route":"./"})           }
        }
    })
}
catch(err)
{
    console.log(err)
}

}
function logout(req,res)
{
   removeCookie("jwt",res,token)
   token=undefined
    currentUser={}
    return res.render("./login")
}
function forgotPasswordPage(req,res)
{
return res.render("./forgotPassword")
}
async function forgotPassword(req,res)
{
const {email}=req.body
await db.query("select * from users where email = $1",[email],async (err,result)=>{
    const user=result.rows[0]
    if(user)
    {
const {token}=createResetToken()
const url=`${req.protocol}://${req.get('host')}/resetPassword/${user["id"]}/${token}`
try{
    await sendEmail({
        email:email,
        subject:"reset Password",
        message:url
    })
    return res.json({})
}
catch(err)
{
    console.log(err)

    }
}
})

return res.json()
}
function resetPassword(req,res)
{
    return res.return("./resetPassword")
}
function resetUserPassword(req,res)
{
const {id,token}=req.params
const {password}=req.body
jwt.verify(token,process.env.SECRET,(err,decToken)=>{
    if(err)
    {
      return  res.render("./register.ejs")
    }
    else{
        try{
db.query("update users set user_password=$1 where id=$2",[password,id])
return res.render("./login.ejs")
        }
        catch(err)
        {
            console.log(err)
        }
    }

})

}
function updatePage(req,res)
{
  return res.render(`./update`)
}
async function getNote(req,res)
{
    const {id}=req.params
await db.query("select * from notes where id=$1",[id],(err,result)=>{
    if(err)
    {
        console.log(err)
    }
    else{
        return res.json(result.rows[0])
    }
})
}
async function updateNote(req,res)
{
    const {id}=req.params
    const {title,text}=req.body
    try{
      await db.query("update notes set title=$1,text=$2 where id =$3",[title,text,id],(err,result)=>{
if(err)
{
    console.log(err)
}
    })  
    return res.status(200).json({"mssg":"success"})
    }
    catch(err)
    {
        console.log(err)
    }
    
}
async function downloadNote(req,res)
{
const rootFolder="C:/Users/Nyabura/Desktop/Notes"
let fileName=undefined
const {id}=req.params
await db.query("select title,text from notes where id=$1",[id],(err,result)=>{
    const {title,text}=result.rows[0]
    fileName=`${title}.txt`
    createDirAndFile(rootFolder,fileName,title,text)
})

}
module.exports={getAllNotes,addNote,deleteNote,loginPage,registerPage,register,login,logout,addNotePage,getNavPage,forgotPassword,forgotPasswordPage,updatePage,getNote,updateNote,updatePage,downloadNote,resetPassword,resetUserPassword}