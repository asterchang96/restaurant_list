const express = require('express')
const router = express.Router()

const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const register_errors = []

  //TODO error
  //1.password != confirmPassword
  if(password !==  confirmPassword) {
    register_errors.push('密碼與驗證密碼不相符！')
    console.log('密碼與驗證密碼不相符！')
    res.render('register',{
      name,
      email,
      password,
      confirmPassword
    })
  } 

  User.findOne({ email })
    .then((user) => {
      if(user){
        console.log('此信箱已經註冊！')
        res.render('register',{
          name,
          email,
          password,
          confirmPassword
        })
      }else{
        return User.create({
          name,
          email,
          password
        })
        .then(() => res.redirect('/'))
        .catch(err => console.error(err))
      }
    })

  
})

module.exports = router