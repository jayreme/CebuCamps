const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground');
mongoose.connect('mongodb://localhost:27017/yelp-camp')


const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i= 0; i < 50; i++){
       const rand = Math.floor(Math.random() * 1000);
       const price = Math.floor(Math.random() * 20) + 10;
        const newCamp = new Campground({
            location: `${cities[rand].city}, ${cities[rand].state}`,
            title: `${descriptors[Math.floor(Math.random()*descriptors.length)]} ${places[Math.floor(Math.random() * places.length)]}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil vitae omnis perspiciatis praesentium consectetur in dolore nobis architecto laudantium voluptates libero error id non, dolorum animi, assumenda fuga aliquam odio?'
        })
    await newCamp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close();
    })

    