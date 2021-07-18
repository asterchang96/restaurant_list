const express = require('express')
const router = express.Router()

const Restaurant_list = require('../../models/restaurants')
let category = [] //隨機選取後之餐廳類型(餐廳已有)

function restaurantCategorySuggest(){  
  return ['素食','速食','早餐和早午餐','美式','墨西哥','中式料理','日本料理','義大利美食','健康飲食','泰國餐點','台灣小吃','韓國美食','甜點','酒吧']
}


//新增餐廳資訊
router.get('/new', (req, res) => {
  const categorySuggest = restaurantCategorySuggest()
  return res.render('new', { category, categorySuggest })
})

//送出餐廳資料
router.post('/',(req, res) => {
  const { name, name_en, category,phone, rating, location, google_map, image, description } = req.body
  const restaurant = new Restaurant_list({ name, name_en, category, phone, rating, location, google_map, image, description })
  return restaurant.save()
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

//動態引入餐廳詳細資料
router.get('/:restaurant', (req, res) => {
  const id = req.params.restaurant
  Restaurant_list.findById(id)
    .lean()
    .then(restaurant => res.render('show', { restaurant }))
    .catch(error => console.error(error))
  
})

//編輯餐廳資料
router.get('/:restaurant/edit', (req, res) =>{
  const id = req.params.restaurant
  const categorySuggest = restaurantCategorySuggest()
  return Restaurant_list.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant , categorySuggest }))
    .catch(error => console.log(error))
})

router.put('/:restaurant', (req, res) =>{
  const id = req.params.restaurant
  return Restaurant_list.findById(id)
    .then(restaurant => {
      restaurant.name = req.body.name
      restaurant.name_en = req.body.name_en
      restaurant.category = req.body.category
      restaurant.phone = req.body.phone
      restaurant.rating = req.body.rating
      restaurant.location = req.body.location
      restaurant.google_map = req.body.google_map
      restaurant.description = req.body.description
      return restaurant.save()
    })
    .then(() => res.redirect(`/restaurants/${id}`))
    .catch(error => console.log(error))
})

//刪除餐廳資料
router.delete('/:restaurant',(req, res) => {
  const id = req.params.restaurant
  return Restaurant_list.findById(id) //先確保id存在
    .then( restaurant => restaurant.remove())
    .then(()=> res.redirect(`/`))
    .catch(error => console.error(error))

})

module.exports = router
