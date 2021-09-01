const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const Restaurant_list = require('../restaurants')
const User = require('../user')
const db = require('../../config/mongoose')

const data = require('./restaurant.json')
const restaurants_data = data.results

const SEED_USERS = [
  {
    name: 'user1',
    email: 'user1@example.com',
    password: '12345678',
    restaurantsID: [1,2,3]
  },
  {
    email: 'user2@example.com',
    password: '12345678',
    restaurantsID: [4,5,6]
  }
]

//success
// 用 user 去創建restaurants
db.once('open', () => {
  Promise.all(SEED_USERS.map(SEED_USER => 
    bcrypt.genSalt(10)
      .then(salt => bcrypt.hash(SEED_USER.password, salt))
      .then(hash => User.create({
        name: SEED_USER.name,
        email: SEED_USER.email,
        password: hash
      }))
      .then(user => {
        const restaurants = restaurants_data.filter(restaurant => SEED_USER.restaurantsID.includes(restaurant.id))
        restaurants.forEach(restaurant => { restaurant.userId = user._id })
        return Restaurant_list.create(restaurants)
      })
  ))
    .then(() => {
      console.log('done.')
      process.exit()
    })
    .catch(error => console.log(error))
})

