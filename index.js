const path = require('path')

const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())''
//If you don’t want to use the cors library, you can manually set CORS headers:
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3001, https://your-frontend-domain.com');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     next();
// });
// app.use((req, res, next) => {
//     const allowedOrigins = ['http://localhost:5173', 'https://your-frontend-domain.com'];
//     const origin = req.headers.origin;

    // Block GET requests from http://localhost:5173
    // if (origin === 'http://localhost:5173' && req.method === 'GET') {
    //     return res.status(403).send('Forbidden');
    // }

    // if (allowedOrigins.includes(origin)) {
    //     res.header('Access-Control-Allow-Origin', origin);
    // }

    // res.header('Access-Control-Allow-Methods', 'PUT, DELETE');
    // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // res.header('Access-Control-Allow-Credentials', 'true');
    // next();
    // });
// app.use(cors({
//     origin: ['http://localhost:3001', 'https://your-frontend-domain.com'], // Allowed origins
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//     credentials: true, // Allow credentials (e.g., cookies)
// }));


const fs = require("fs");
const json_path = path.join(__dirname, "data.json");
let notes = require("./data.json");
console.log(notes);

// let notes = [
// {
//     id: "1",
//     content: "HTML is easy",
//     important: true
// },
// {
//     id: "2",
//     content: "Browser can execute only JavaScript",
//     important: false
// },
// {
//     id: "3",
//     content: "GET and POST are the most important methods of HTTP protocol",
//     important: true
// },
// {
//     id: "4",
//     content: "test test test test",
//     important: true
// }
// ]

app.get('/', (req, res) => {
    res.type('html');
    res.status(300).send('<h1>Hello World!</h1>');
})

app.get('/api/notes', (req, res) => {
    res.type('json').send(notes);
    // res.json(notes);
})

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const note = notes.find(note => note.id == id);
    if (note)
        res.json(note);
    else
        res.status(404).end();
})

app.post('/api/notes', (request, response) => {
    const note = request.body;
    if (notes.find(el => el.id === note.id))
        return response.status(400).send("id already exists");
    let new_notes = [...notes, note];
    fs.writeFileSync(json_path, JSON.stringify(new_notes, null, 2));
    console.log(note)
    response.json(note)
})


app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    const note = notes.find(note => note.id === id);
    if (note) {
        notes = notes.filter(note => note.id !== id);
        fs.writeFileSync(json_path, JSON.stringify(notes, null, 2));
        res.status(204).end();
    }
    else
        res.status(404).end();
})

app.get('/redirect', (req, res) => {
    res.redirect('/');
})
app.get('/404', (req, res) => {
    res.status(404).send('<h1>NOT FOUND 404</h1>');
})

app.get('/headers', (req, res) => {
    res.set({
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-cache',
        'Custom-Header': 'Hello World',
        'content-length': 8
    });
    res.send('Response with custom headers');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/file', (req, res) => {
    console.log("whatever");
    console.log("normal", __dirname + '/public/index.html');
    res.sendFile(__dirname + '/public/index.html'); // Send an HTML file
});

app.get('/download', (req, res) => {
    res.download(__dirname + '/public/export.pdf'); // Force the browser to download the file
});

app.get('/csv', (req, res) => {
    res.type('text/csv'); // Set Content-Type to text/csv
    res.send('name,age\nJohn,30\nJane,25');
});

app.get('/xml', (req, res) => {
    res.type('application/xml'); // Set Content-Type to application/xml
    res.send('<note><body>This is XML</body></note>');
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

module.exports = app;