const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const app = express();
const mongoose = require('mongoose');

const Campground = require('./models/campground');

//database connection
mongoose.connect('mongodb://localhost:27017/yelp-camp')


const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error'));
db.once('open', () => {
    console.log("Database Connected");
})


app.set('view engine','ejs');
app.engine('ejs',ejsMate)
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});

app.get('/campgrounds/new', async (req , res) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', async (req ,res) => {
    const obj = req.body;
    const newCamp = new Campground(obj.campground);
    await newCamp.save();
    res.redirect(`/campgrounds/${newCamp._id}`);
})


app.get('/campgrounds/:id', async (req ,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/show', {campground})
});

app.get('/campgrounds/:id/edit', async (req ,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', {campground})
});
    
app.put('/campgrounds/:id', async (req ,res) => {       
    const { id } = req.params;
    const update = req.body;
    const campground = await Campground.findByIdAndUpdate(id,{...update.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id', async (req ,res) =>{
    const { id } = req.params;
    await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds');
})

app.use((req,res) => {
    res.status(404).send("PAGE NOT FOUND!!")
})

app.listen(3000, () => {
    console.log("Serving on port 3000");   
});