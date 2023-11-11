const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()
const bcrypt = require('bcrypt');
const maxLifeSpan=36000000
const nodemailer=require("nodemailer")
const fs=require("fs").promises
const fsSync=require("fs")
const PDFDocument = require('pdfkit');
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
function generateRandomUserIds()
{
    let id=undefined
    id=Number.parseInt(Math.random() * 1000000 +(Math.random() * 1000 + 1))
    return id
}
function createResetToken(id)
{
    const expires=Date.now()* 1 * 3600 * 1000
let token=jwt.sign({id},process.env.SECRET,{expiresIn:expires})
return {token,expires}
}
async function sendEmail(options)
{
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'brianruhiu7504@gmail.com',
          pass: "qwerty@254" 
        }
      });
      const emailOption={
        from:"brianruhiu7504@gmail.com",
        to:options.email,
        subject:options.subject,
        text:options.message
      }
      await transport.sendMail(emailOption)
}
function deleteFile(fileName)
{
  try{
    fs.unlinkSync(fileName)
        }
        catch(err)
        {
    console.log(err)
        }
}


async function createDirAndFile(dir, file, title, text) {
  try {
    try {
      await fs.access(dir);
      console.log('Directory already exists');
    } catch (error) {
      await fs.mkdir(dir, { recursive: true });
    }
    try {
      await fs.access(`${dir}/${file}`);
    } catch (error) {
      
      console.log('File created successfully');
    }
    fsSync.writeFileSync(`${dir}/${file}`, `Title:${title}\n\n\n${text}`);
    
    // await fs.unlink(`${dir}/${file}`);
  } catch (error) {
    console.error('An error occurred:', error);
  }
//   convertTxtToPdf(dir,file,title)
}
function convertTxtToPdf(dir,file,title)
{
    let doc;
    doc = new PDFDocument();
    doc.pipe(fsSync.createWriteStream(`${dir}/${title}.pdf`));
    let data = fsSync.readFileSync(`${dir}/${file}`, 'utf8');
    doc
  .text(data);
  doc.save()
  doc.end();
}


module.exports={createJsonWebToken,maxLifeSpan,hashPassword,unHashPassword,removeCookie,generateRandomUserIds,createResetToken,sendEmail,deleteFile,createDirAndFile}