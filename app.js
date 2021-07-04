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
app.get('/', (req, res ) => {
  console.log(restaurant_list.results)
  res.render('index', {restaurants : restaurant_list.results})
})

app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})