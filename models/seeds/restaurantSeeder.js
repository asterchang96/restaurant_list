const Restaurant = require('../restaurants')
const data = require('./restaurant.json')
const restaurants_data = data.results

const db = require('../../config/mongoose')

//success
db.once('open', () =>{
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