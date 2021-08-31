const express = require('express')
const router = express.Router()

const Restaurant_list = require('../../models/restaurants')
let category = [] //隨機選取後之餐廳類型(餐廳已有)

//餐廳推薦字
function restaurantCategorySuggest(){  
  return ['素食','速食','早餐和早午餐','中式料理','日本料理','義大利美食','泰式料理','韓國美食','甜點','酒吧']
}


//新增餐廳資訊
router.get('/new', (req, res) => {
  const categorySuggest = restaurantCategorySuggest()
  return res.render('new', { category, categorySuggest })
})

//送出餐廳資料
router.post('/',(req, res) => {
  const { name, name_en, category,phone, rating, location, google_map, image, description } = req.body
  const userId = req.user._id
  const restaurant = new Restaurant_list({ name, name_en, category, phone, rating, location, google_map, image, description, userId})
  return restaurant.save()
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

//動態引入餐廳詳細資料
router.get('/:restaurant', (req, res) => {
  const userId = req.user._id
  const _id = req.params.restaurant
  Restaurant_list.findOne({ _id, userId })
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
})

//編輯餐廳資料
router.get('/:restaurant/edit', (req, res) =>{
  const userId = req.user._id
  const _id = req.params.restaurant
  const categorySuggest = restaurantCategorySuggest()
  return Restaurant_list.findOne({ _id, userId })
    .lean()
    .then((restaurant) => res.render('edit', { restaurant , categorySuggest }))
    .catch(error => console.log(error))
})

//送出編輯後餐廳資料
router.put('/:restaurant', (req, res) =>{
  const { name, name_en, category,phone, rating, location, google_map, image, description } = req.body
  const userId = req.user._id
  const _id = req.params.restaurant
  return Restaurant_list.findOne({ _id, userId })
    .then(restaurant => {
      restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.phone = phone
      restaurant.rating = rating
      restaurant.location = location
      restaurant.google_map = google_map
      restaurant.image = image
      restaurant.description = description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${_id}`))
    .catch(error => console.log(error))
})

//刪除餐廳資料
router.delete('/:restaurant',(req, res) => {
  const _id = req.params.restaurant
  return Restaurant_list.findById(_id)
    .then( restaurant => restaurant.remove())
    .then(()=> res.redirect(`/`))
    .catch(error => console.error(error))

})

module.exports = router
