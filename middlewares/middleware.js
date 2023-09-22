const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
function authUser(req,res,next)
{
    const token=req.cookies.jwt
   
if(token)
{
    jwt.verify(token,process.env.SECRET,(err,decToken)=>
    {
if(err)
{
  return  res.render("./login.ejs")
}
else{
    next()
}
    })
}
else{
   return res.render("./login.ejs")
}
}
module.exports={authUser}