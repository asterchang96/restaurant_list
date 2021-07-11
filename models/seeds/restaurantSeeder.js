const mongoose = require('mongoose')
const Restaurant = require('../restaurants')
const data = require('./restaurant.json')

const restaurants_data = data.results


mongoose.connect('mongodb://localhost/restaurant_list', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection


//error
db.on('error', () => {
  console.log('mongodb error!')
})

//success
db.once('open', () =>{
  console.log('mongoDB connection')
  restaurants_data.forEach((restaurant) => {
    Restaurant.create({
      id: restaurant.id,
      name: restaurant.name,
      name_en: restaurant.name_en,
      category: restaurant.category,
      image: restaurant.image,
      location: restaurant.location,
      phone: restaurant.phone,
      google_map: restaurant.google_map,
      rating: restaurant.rating,
      description: restaurant.description
    })
  })
  console.log('done.')
})