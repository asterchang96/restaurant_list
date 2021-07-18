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

//搜尋餐廳
router.get('/', (req, res) => {
  const { sortItem, sortMethod, sortName } = req.query
  const sort = {}
  sort[sortItem] = sortMethod
  const keyword = (req.query.keyword).replace(/\s*/g,"")
  let restaurants_search = []


  // TODO:sort
  search_result_howmany_restaurants = true
  category = sortAndPick(pre_category_restaurant)

  if(sortItem){
    Restaurant_list.find()
      .lean()
      .sort(sort)
      .then((restaurants) => {
        restaurants_search = restaurants.filter((restaurant) => {
          let temp_restaurants = restaurant.name.toLowerCase().includes(keyword.toLowerCase())
          temp_restaurants += restaurant.category.includes(keyword)
          return temp_restaurants
        })  
        if(keyword === ''){
          search_result_howmany_restaurants = false
        }
        res.render('index', {restaurants : restaurants_search, keyword , search_result : search_result_howmany_restaurants, category, sortName })
      })    
  }else{
    Restaurant_list.find()
      .lean()
      .then((restaurants) => {
        restaurants_search = restaurants.filter((restaurant) => {
          let temp_restaurants = restaurant.name.toLowerCase().includes(keyword.toLowerCase())
          temp_restaurants += restaurant.category.includes(keyword)
          return temp_restaurants
        })  
        if(keyword === ''){
          search_result_howmany_restaurants = false
        }
        res.render('index', {restaurants : restaurants_search, keyword , search_result : search_result_howmany_restaurants, category, sortName })
      })    
  }
})
module.exports = router