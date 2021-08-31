const express = require('express')
const router = express.Router()
const Restaurant_list = require('../../models/restaurants')
/* let search_result_howmany_restaurants = false */
let pre_category_restaurant = new Set()

//主頁/search/試試看功能
function sortAndPick(pre_category_restaurant, userId){
  //search category
  
  Restaurant_list.find({ userId }).lean().then((restaurants) => {
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

  return shuffle(category_restaurant_list).slice(0,5)
}


router.get('/', (req, res) => {
  const userId = req.user._id
/*   search_result_howmany_restaurants = false */
  
  Promise.all(sortAndPick(pre_category_restaurant, userId))
    .then((results) => {
      const category = results   
      console.log('pre_category_restaurant', pre_category_restaurant)
      Restaurant_list.find({ userId })
        .lean()
        .sort({ _id: 'asc' })
        .then(restaurants => res.render('index', { restaurants, category }))
    })
    .catch(err => console.error(err))
})

module.exports = router