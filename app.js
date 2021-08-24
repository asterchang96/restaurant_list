const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

//自訂義
const routes = require('./routes')
require('./config/mongoose')

const app = express()
const port = 3000

app.locals.sayHi = 'Hello World!'

// setting template engine
app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

//use express-session
app.use(session({
  secret: 'ThisIsMySecret',
  resave: false,
  saveUninitialized: true
}))

//setting static files
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

//引入餐廳動態資料
app.use(routes)


app.listen(port, () => {
  console.log(`Express is running on http://localhost:${port}`)
})