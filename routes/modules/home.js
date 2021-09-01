const express = require('express')
const router = express.Router()
const Restaurant_list = require('../../models/restaurants')
let pre_category_restaurant = new Set()


  //shuffle 隨機排序
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


router.get('/', (req, res) => {
  const userId = req.user._id
  Restaurant_list.find({ userId })
    .lean()
    .sort({ _id: 'asc' })
    .then((restaurants) => {
      restaurants.forEach((restaurant) => {
        pre_category_restaurant.add(restaurant.category)
      })
      let category_restaurant_list = [...pre_category_restaurant]
      res.render('index', { restaurants, category: shuffle(category_restaurant_list).slice(0,5) })
    })
    .catch(err => console.error(err))
})

module.exports = router