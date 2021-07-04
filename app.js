// Include express from node_modules
const express = require('express')
const exphbs = require('express-handlebars')
const restaurant_list = require('./restaurant.json')


const app = express()
const port = 3000

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))

//引入餐廳動態資料
app.get('/', (req, res) => {
  let search_result = false

  //search category
  //抽取不重複的category
  const category = []
  restaurant_list.results.forEach((restaurant) => {
    category.push(restaurant.category)
  })
  const category2 = Array.from( new Set(category) );
  //console.log(category)
  console.log(category2)


  res.render('index', {restaurants : restaurant_list.results,search_result : search_result,category:category2})
})

//動態引入餐廳詳細資料
app.get('/restaurants/:restaurant', (req, res) => {
  //console.log(req.params.restaurant)
  const restaurant_id = restaurant_list.results.find((restaurant) => restaurant.id.toString() === req.params.restaurant.toString())
  res.render('show', {restaurant : restaurant_id})
})

//搜尋餐廳
app.get('/search', (req, res) => {
  const keyword = req.query.keyword
  const category = req.query.category
  console.log(req.query)

  //搜尋到幾筆相關資料(搜尋後才產生)
  search_result = true

  //searchbar 有資料
  let searchbarTorestaurants = []
  let categoryTorestaurants = []
  if(!category){
    searchbarTorestaurants = restaurant_list.results.filter((restaurant) =>{
      return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
    })
    //搜尋分類
    searchbarTorestaurants = restaurant_list.results.filter((restaurant) =>{
      return restaurant.category.includes(keyword)
    })   
  }else{
    //category-group 搜尋...
    categoryTorestaurants = restaurant_list.results.filter((restaurant) =>{
      return restaurant.category.includes(category)
    })    
  }



  
  const restaurants = searchbarTorestaurants.concat(categoryTorestaurants)

  res.render('index', {restaurants : restaurants, keyword : keyword,search_result:search_result})
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})