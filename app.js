// Include express from node_modules
const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')

const Restaurant_list = require('./models/restaurants')
let pre_category_restaurant = new Set(); //所有餐廳類型
let category_restaurant = [] //隨機選取後之餐廳類型
let search_result_howmany_restaurants = false

const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

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
  category_restaurant = sortAndPick(pre_category_restaurant)

  //引入restaurant database
  Restaurant_list.find()
    .lean()
    .then(restaurants => res.render('index', {restaurants , search_result : search_result_howmany_restaurants, category : category_restaurant}))


})

//新增餐廳資訊
app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants',(req, res) => {

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
  category_restaurant = sortAndPick(pre_category_restaurant)
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
      res.render('index', {restaurants : restaurants_search, keyword : keyword, search_result : search_result_howmany_restaurants, category : category_restaurant})
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
  return shuffle(category_restaurant_list).slice(0,4)
}
