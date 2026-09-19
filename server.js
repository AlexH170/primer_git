import express from 'express';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import cors from 'cors';

dotenv.config();
const app = express();

let connection;
app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors());

async function connectionDB(){
    try {
        connection = await mysql.createConnection({
            host : process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user : process.env.DB_USER,
            password : String(process.env.DB_PASS),
            database : process.env.DB_NAME,
        });
        console.log('Conexion exitosa a la base de datos');
    } catch (error) {
        console.log('Error de conexion:', error);
    }
}

const port = process.env.PORT || 3000;

app.get('/', (req,res) => {
    res.send('Bienvenido');
});

// OBTENER TODOS LOS USUARIOS
app.get('/users', async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM usuarios');
        res.json(rows);
    } catch (error) {
        console.log('Error al obtener usuarios:', error);
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
});

// BUSCAR USUARIO POR CODIGO
app.get('/user/:codigo', async (req, res) => {
    try {
        const { codigo } = req.params;
        const [rows] = await connection.query('SELECT * FROM usuarios WHERE codigo = ?', [codigo]);

        if (rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.log('Error al buscar usuario:', error);
        res.status(500).send("Error en el servidor");
    }
});

// CREAR NUEVO USUARIO
app.post('/user', async (req,res) => {
    try{
        const {codigo, nombre, apellidos, correo, password} = req.body;
        const consulta = `INSERT INTO usuarios (nombre, apellidos, correo, password) VALUES (?, ?, ?, ?)`;
        await connection.query(consulta, [codigo, nombre, apellidos, correo, password]);
        res.status(201).json({mensaje: 'Usuario creado exitosamente'});
    }catch(error){
        console.log("Error al crear usuario:", error);
        res.status(500).json({mensaje: 'Error al crear usuario'});
    }
});

// ACTUALIZAR DATOS
app.put('/user/:codigo', async (req, res) => {
  try {
    const { codigo } = req.params;
    const { nombre, apellidos, correo, password } = req.body;

    const [result] = await connection.query(
      'UPDATE usuarios SET nombre = ?, apellidos = ?, correo = ?, password = ? WHERE codigo = ?',
      [nombre, apellidos, correo, password, codigo]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario actualizado correctamente' });
  } catch (error) {
    console.log('Error al actualizar usuario:', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
});

// BORRAR DATOS
app.delete('/user/delete', async (req, res) => {
  try {
    const { codigo } = req.query;   // 👈 cambia params por query

    const [result] = await connection.query('DELETE FROM usuarios WHERE codigo = ?', [codigo]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.log('Error al eliminar usuario:', error);
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
});

app.listen(port, ()=> {
    console.log(`Servidor funcionando correctamente en http://localhost:${port}`);
});

connectionDB();