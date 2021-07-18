const express = require('express')
const router = express.Router()

const Restaurant_list = require('../../models/restaurants')
let pre_category_restaurant = new Set()
let category = [] //隨機選取後之餐廳類型(餐廳已有)
let search_result_howmany_restaurants = false


function sortAndPick(pre_category_restaurant){

  //search category
  Restaurant_list.find().lean().then((restaurants) => {
    restaurants.forEach((restaurant) => {
    pre_category_restaurant.add(restaurant.category)
  })
  })

  //set 改 arr
  let category_restaurant_list = [...pre_category_restaurant]

  //shuffle 隨機排序
  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  } 

  //取5個
  return shuffle(category_restaurant_list).slice(0,5)
}


router.get('/', (req, res) => {
  search_result_howmany_restaurants = false

  category = sortAndPick(pre_category_restaurant)// 隨機產生category
  

  //引入restaurant database
  Restaurant_list.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants , search_result : search_result_howmany_restaurants, category}))
})

module.exports = router