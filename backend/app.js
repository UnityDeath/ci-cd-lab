const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8081;
const cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// In-memory store (для учебных целей)
let visits = 0;
let tasks = [
{ id: 1, title: 'Пример задачи', description: 'Это тестовая задача' }
];
let nextId = 2;


app.get('/api/health', (req, res) => {
res.json({ status: 'ok' });
});


app.get('/api/time', (req, res) => {
res.json({ time: new Date().toISOString() });
});


app.get('/api/visits', (req, res) => {
visits += 1;
res.json({ visits });
});


app.get('/api/tasks', (req, res) => {
res.json(tasks);
});


app.post('/api/tasks', (req, res) => {
const { title, description } = req.body;
if (!title) return res.status(400).json({ error: 'title required' });
const task = { id: nextId++, title, description: description || '' };
tasks.push(task);
res.status(201).json(task);
});


if (require.main === module) {
app.listen(port, () => console.log(`App listening on port ${port}`));
}


module.exports = app;