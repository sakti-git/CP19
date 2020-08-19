const express = require('express');
const path  = require('path');
const bodyParser = require('body-parser')

const fs = require('fs');
let data = JSON.parse(fs.readFileSync('./data.json'));

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, 'public')));

app.get('/',(req,res) => res.render('list', {data}));

app.get('/add',(req,res) => res.render('add'));

app.post('/add',(req,res) => {
    data.push(req.body);
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('/');
});

app.get('/delete/:id',(req,res) => {
    const id = req.params.id;
    data.splice(id, 1);
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('/');
});

app.get('/edit/:id', (req, res) => {
    const id = req.params.id;
    res.render('edit', { item: { ...data[id] }, id });
})

app.post('/edit/:id', (req, res) => {
    const id = (req.body.id)-1;
    const edit = {
        string: req.body.string,
        integer: req.body.integer,
        float: req.body.float,
        date: req.body.date,
        boolean: req.body.boolean
    }
    data.splice(id, 1, edit);
    fs.writeFileSync('data.json', JSON.stringify(data));
    res.redirect('/')
});

app.listen(3000,() => {
    console.log('This web is working on port 3000!')
}) 