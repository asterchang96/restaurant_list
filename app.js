// Include express from node_modules
const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const methodOverride = require('method-override')

const app = express()
const port = 3000

const routes = require('./routes')
// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

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
app.use(routes)


app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})