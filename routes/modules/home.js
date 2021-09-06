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


//首頁
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
      pre_category_restaurant.clear()
      res.render('index', { restaurants, category: shuffle(category_restaurant_list).slice(0,5) })
    })
    .catch(err => console.error(err))
})

//搜尋餐廳
router.get('/search', (req, res) => {
  const userId = req.user._id
  const { sortItem, sortMethod, sortName } = req.query
  const sort = {}
  sort[sortItem] = sortMethod
  if(!sort) sort = { _id: 'asc' }
  const keyword = (req.query.keyword).replace(/\s*/g,"").toLowerCase()

  Restaurant_list.find({ userId }).lean().sort(sort)
    .then((restaurants) => {

      restaurants.forEach((restaurant) => {
        pre_category_restaurant.add(restaurant.category)
      })
      let category_restaurant_list = [...pre_category_restaurant]
      pre_category_restaurant.clear()

      let restaurants_search = restaurants.filter((restaurant) => {
        let temp_restaurants = restaurant.name.toLowerCase().includes(keyword) || restaurant.category.includes(keyword)
        return temp_restaurants
      })
      res.render('index', { restaurants : restaurants_search, keyword , category: shuffle(category_restaurant_list).slice(0,5), sortName })
    })
    .catch(err => console.error(err))
})

module.exports = router