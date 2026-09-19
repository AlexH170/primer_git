import express from 'express';
import dotenv from 'dotenv';
import mysql2 from 'mysql2/promise'

dotenv.config();

const app = express();

const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('<h1>Saludos desde el backend</h1>');
});
//async  va a ser asincrónico es decir que no hará todo al mismo tiempo
//promise alguien promete en algun momento el usuario hará click 
async function connectionDB(){
    try{
        const connection = await mysql.createconectDB{
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            pass : process.env.DB_PASS,
            dataname : process.env.DB_NAME
        }
        console.log("Conexión exitosa");
    }catch(error){
        console.error("tronó", error)
    }
}

app.listen(port, ()=>{
    console.log(`Puerto funcionando correctamente ${port}`)
});