const jwt=require("jsonwebtoken")
function authUser(req,res,next)
{
const token=res.cookie["jwt"]
if(token)
{
    jwt.verify()
}
}
module.exports={authUser}