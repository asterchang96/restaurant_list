// Include express from node_modules
const express = require('express')
const exphbs = require('express-handlebars')
const restaurant_list = require('./restaurant.json')
let category_restaurant = [] //餐廳類型

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
  let pre_category_restaurant = new Set();

  //search category
  restaurant_list.results.forEach((restaurant) => {
    pre_category_restaurant.add(restaurant.category)
  })
  category_restaurant = sortAndPick(pre_category_restaurant)

  res.render('index', {restaurants : restaurant_list.results,search_result : search_result,category:category_restaurant})
})

//動態引入餐廳詳細資料
app.get('/restaurants/:restaurant', (req, res) => {
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
    //一般keywords搜尋
    searchbarTorestaurants = restaurant_list.results.filter((restaurant) =>{
      return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
    })
    //keywords分類搜尋
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


//function 區
//隨機抽取5個
function sortAndPick(pre_category_restaurant){
  //set 改 arr
  let category_restaurant_list = [...pre_category_restaurant]

  //shuffle 隨機排序
  function shuffle(array) {
    var m = array.length,
        t, i;
    while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
    }
    return array;
  }
  
  //取5個
  return shuffle(category_restaurant_list).slice(0,3)
}
