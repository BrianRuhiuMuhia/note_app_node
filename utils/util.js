const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()
const bcrypt = require('bcrypt');
const maxLifeSpan=36000000
function createJsonWebToken(id)
{
return jwt.sign({id},process.env.SECRET,{expiresIn:maxLifeSpan})
}
function hashPassword(userPassword)
{
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(userPassword, salt);
    return hash
}
function unHashPassword(password,hashedPassword)
{
    return bcrypt.compareSync(password,hashedPassword)
}
function removeCookie(cookieName,res,token)
{
    res.cookie("jwt",token,{maxAge:0})
}
module.exports={createJsonWebToken,maxLifeSpan,hashPassword,unHashPassword,removeCookie}