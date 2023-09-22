const jwt=require("jsonwebtoken")
function authUser(req,res,next)
{
const token=res.cookie["jwt"]
if(token)
{
    jwt.verify(token,process.env.SECRET,(err,decToken)=>
    {
if(err)
{
    res.redirect("./")
}
else{
    next()
}
    })
}
else{
    res.redirect("./")
}
}
module.exports={authUser}