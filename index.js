const Joi = require('joi');
const express = require('express');

const app = express();
app.use(express.json());

const courses = [
    {
        id: 1,
        name: 'One'
    },
    {
        id: 2,
        name: 'Two'
    },
    {
        id: 3,
        name: 'Three'
    }
];

app.get('/', (req, res) => {
    res.send('Hello');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.get('/api/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(course => course.id === id);

    if (!course) {
        res.status(404).send('Course not found');
    } else {
        res.send(course);
    }
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };

    courses.push(course);
    res.send(course);
});

app.put('/api/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(course => course.id === id);

    if (!course) {
        return res.status(404).send('Course not found');
    }

    const { error } = validateCourse(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    course.name = req.body.name;

    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const course = courses.find(course => course.id === id);

    if (!course) {
        return res.status(404).send('Course not found');
    }

    const index = courses.indexOf(course);
    courses.splice(index, 1);

    res.send(course);
});

function validateCourse(course) {
    const schema = {
        name: Joi.string().min(3).required()
    };

    return Joi.validate(course, schema);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));