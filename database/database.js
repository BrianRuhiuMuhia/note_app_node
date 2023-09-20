const pg=require("pg")
const dotenv=require("dotenv")
dotenv.config()
const db=new pg.Pool({
host:process.env.localhost,
user:process.env.user,
port:process.env.db_port,
password:process.env.password,
database:process.env.database
})
module.exports={db}