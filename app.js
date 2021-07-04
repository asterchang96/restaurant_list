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
  res.render('index', {restaurants : restaurant_list.results})
})

//動態引入餐廳詳細資料
app.get('/restaurants/:restaurant', (req, res) => {
  //console.log(req.params.restaurant)
  const restaurant_id = restaurant_list.results.find((restaurant) => restaurant.id.toString() === req.params.restaurant.toString())
  res.render('show', {restaurant : restaurant_id})
})

//搜尋餐廳
app.get('/search', (req, res) => {
  console.log(req.query.keyword)
  const keyword = req.query.keyword
  const restaurants = restaurant_list.results.filter((restaurant) =>{
    return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
  })
  res.render('index', {restaurants : restaurants, keyword : keyword})
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})