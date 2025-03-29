const express = require("express")
const path = require('path');
const app = express();
const morgan = require("morgan")
app.use(express.json());
app.use(express.static('dist'));
// app.use(morgan('tiny')); //Morgan is a logging middleware for Express.
// Morgan logs after the response is sent, so it can access req.body even if express.json() is placed after it.
// This is because Morgan hooks into the response's 'finish' event, allowing it to observe the final state of req.body.
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :req[Content-Length] - :response-time ms :body'));

let persons = [
    { 
        id: "1",
        name: "Arto Hellas", 
        number: "040-123456"
    },
    { 
        id: "2",
        name: "Ada Lovelace", 
        number: "39-44-5323523"
    },
    { 
        id: "3",
        name: "Dan Abramov", 
        number: "12-43-234345"
    },
    { 
        id: "4",
        name: "Mary Poppendieck", 
        number: "39-23-6423122"
    }
]
//get
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
app.get("/info", (req, res) => {
    const txt = `Phonebook has info for ${persons.length} people<br />${new Date()}`;
    res.send(txt);
})
app.get("/api/persons", (req, res) => {
    res.json(persons);
})
app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id; //parsed by Express from the URL. don't need express.json()
    const found = persons.find(pers => pers.id === id);
    if (found)
        res.json(found);
    else
    res.status(404).end();
})

//delete
app.delete("/api/persons/:id", (req, res) => {
    const id = req.params.id;
    if (!persons.some(pers => pers.id === id))
        return res.status(404).end();
    else {
        persons = persons.filter(pers => pers.id !== id);
        res.status(204).end(); 
    }
})

//post
function generateRandomId() {
    return Math.round(Math.random() * 1000000000).toString();
}
app.post("/api/persons", (req, res) => {
    const body = req.body; // Requires express.json()
    if (!body.name || !body.number) {
        return res.status(400).json({ error: "Name and number are required" });
    }
    if (persons.some(p => p.name === body.name)) {
        return res.status(400).json({ error: "Name must be unique" });
    }
    const newPerson = {
        id: generateRandomId(),
        name: body.name,
        number: body.number
    };
    persons = persons.concat(newPerson);
    res.status(201).json(newPerson);
});


app.listen(3001, () => {
    console.log("server running on port 3001")
})