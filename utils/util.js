const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()
const maxLifeSpan=36000000
function createJsonWebToken(id)
{
return jwt.sign({id},"keyboard",{expiresIn:maxLifeSpan})
}
module.exports={createJsonWebToken,maxLifeSpan}