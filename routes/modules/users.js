const express = require('express')
const router = express.Router()
const passport = require('passport')
const bcrypt = require('bcryptjs')

const User = require('../../models/user')

router.get('/login', (req, res) => {
  res.render('login')
})

//TODO 登入失敗可以顯示訊息
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const register_errors = []

  //TODO 驗證
  if (!name || !email || !password || !confirmPassword) {
    register_errors.push({ message: '所有欄位都是必填！'})
  }
  if(password !==  confirmPassword) {
    register_errors.push({ message : '密碼與驗證密碼不相符！'})
  }

  if(register_errors.length){
    console.log(register_errors)
    return res.render('register',{
      register_errors,
      name,
      email,
      password,
      confirmPassword
    })
  }

  User.findOne({ email })
    .then((user) => {
      //fail
      if(user){
        register_errors.push({ message : '此信箱已經註冊！'})
        return res.render('register',{
          register_errors,
          name,
          email,
          password,
          confirmPassword
        })
      }
      //success
      return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash =>{
        User.create({
          name,
          email,
          password: hash
        })
      })
      .then(() => res.redirect('/'))
      .catch(err => console.error(err))
    })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', '你已經成功登出。')
  res.redirect('/users/login')
})

module.exports = router