// Include express from node_modules
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Restaurant_list = require('./models/restaurants')
let pre_category_restaurant = new Set(); //所有餐廳類型
let category = [] //隨機選取後之餐廳類型
let search_result_howmany_restaurants = false

const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

//database
mongoose.connect('mongodb://localhost/restaurant_list',{ useNewUrlParser: true , useUnifiedTopology: true })
const db = mongoose.connection
// 連線異常
db.on('error', () => {
  console.log('mongodb error!')
})
// 連線成功
db.once('open', () => {
  console.log('mongodb connected!')
})


//引入餐廳動態資料
app.get('/', (req, res) => {
  search_result_howmany_restaurants = false

  // 隨機產生category
  category = sortAndPick(pre_category_restaurant)

  //引入restaurant database
  Restaurant_list.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants , search_result : search_result_howmany_restaurants, category}))
})

//新增餐廳資訊
app.get('/restaurants/new', (req, res) => {
  return res.render('new', {category})
})

//送出餐廳資料
app.post('/restaurants',(req, res) => {
  console.log(req.body)
  const name = req.body.name
  const name_en = req.body.name_en
  const category = req.body.category
  const phone = req.body.phone
  const rating = req.body.rating
  const location = req.body.location
  const google_map = req.body.google_map
  const image = req.body.image
  const description = req.body.description

  const restaurant = new Restaurant_list({ name, name_en, category, phone, rating, location, google_map, image, description})
  return restaurant.save() //write back to server
    .then(() => res.redirect('/'))
    .catch(error => console.error(error))
})

//編輯餐廳資料
app.get('/restaurants/:restaurant/edit', (req, res) =>{
  const id = req.params.restaurant
  return Restaurant_list.findById(id)
    .lean()
    .then((restaurant) => res.render('edit', { restaurant , category }))
    .catch(error => console.log(error))
})

app.post('/restaurants/:restaurant/edit', (req, res) =>{
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
app.post('/restaurants/:restaurant/delete',(req, res) => {
  const id = req.params.restaurant
  return Restaurant_list.findById(id) //先確保id存在
    .then( restaurant => restaurant.remove())
    .then(()=> res.redirect(`/`))
    .catch(error => console.error(error))

})

//動態引入餐廳詳細資料
app.get('/restaurants/:restaurant', (req, res) => {
  const id = req.params.restaurant
  Restaurant_list.findById(id)
    .lean()
    .then(restaurant => res.render('show', {restaurant}))
    .catch(error => console.error(error))
  
})

//搜尋餐廳
app.get('/search', (req, res) => {
  category = sortAndPick(pre_category_restaurant)
  const keyword = (req.query.keyword).replace(/\s*/g,"")
  let restaurants_search = []
  search_result_howmany_restaurants = true
  //一般keywords搜尋、keywords分類搜尋==>顯示搜尋資料
  Restaurant_list.find()
    .lean()
    .then((restaurants) => {
      restaurants_search = restaurants.filter((restaurant) => {
        let temp_restaurants = restaurant.name.toLowerCase().includes(keyword.toLowerCase())
        temp_restaurants += restaurant.category.includes(keyword)
        return temp_restaurants
      })  
      
      //特殊keywords搜尋(未輸入)==>顯示全部資料
      if(keyword === ''){
        search_result_howmany_restaurants = false
      }
      res.render('index', {restaurants : restaurants_search, keyword : keyword, search_result : search_result_howmany_restaurants, category })
    })
})


app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})


//function 區

//隨機抽取4個

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
  //取4個
  return shuffle(category_restaurant_list).slice(0,5)
}
