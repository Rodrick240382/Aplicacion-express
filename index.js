//Importamos las librarías requeridas
const express = require('express')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
//const cors = require('cors');

//Documentación en https://expressjs.com/en/starter/hello-world.html
const app = express()


//Creamos un parser de tipo application/json
//Documentación en https://expressjs.com/en/resources/middleware/body-parser.html
const jsonParser = bodyParser.json()


// Abre la base de datos de SQLite
let db = new sqlite3.Database('./base.sqlite3', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado a la base de datos SQLite.');

    db.run(`CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        todo TEXT NOT NULL,
        created_at INTEGER
    )`, (err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Tabla tareas creada o ya existente.');
        }
    });
});

//Modificacion del endpoint
app.post('/insert', jsonParser, function (req, res) {
    //Imprimimos el contenido del campo todo
    const { todo } = req.body;
   
    console.log(todo);
    res.setHeader('Content-Type', 'application/json');

    if (!todo) {
        res.status(400).send('Falta información necesaria');
        return;
    }
    const stmt  =  db.prepare('INSERT INTO todos (todo, created_at) VALUES (?, CURRENT_TIMESTAMP)');

    stmt.run(todo, (err) => {
        if (err) {
          console.error("Error running stmt:", err);
          res.status(500).send(err);
          return;

        } else {
          console.log("Insert was successful!");
        }
    });

    stmt.finalize();
    
    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    res.status(201).send();
})

app.get('/', function (req, res) {
    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'status': 'ok2' }));
})

// Endpoint para obtener la lista de todos (creado el 11 mayo 2025)
app.get('/todos', (req, res) => {
    const query = 'SELECT * FROM todos';

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Error al ejecutar la consulta:", err);
            res.status(500).json({ error: "Error al obtener los datos" });
            return;
        }

        // Enviamos los resultados como JSON
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(rows);
    });
});

//Creamos un endpoint de login que recibe los datos como json
app.post('/login', jsonParser, function (req, res) {
    //Imprimimos el contenido del body
    console.log(req.body);

    //Enviamos de regreso la respuesta
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 'status': 'ok' }));
})

//Corremos el servidor en el puerto 3000
const port = 3000;

app.listen(port, () => {
    console.log(`Aplicación corriendo en http://localhost:${port}`)
})

// Endpoint POST /agrega_todo
app.post('/api/agrega_todo', (req, res) => {
    // Obtener los datos del body de la solicitud
    const nuevoDato = req.body;
    
    // Validar que los datos no estén vacíos
    if (!nuevoDato || Object.keys(nuevoDato).length === 0) {
        return res.status(400).json({
            error: 'No se proporcionaron datos'
        });
    }
})