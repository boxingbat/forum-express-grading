const path = require('path')
const express = require('express')
const exphbs = require('express-handlebars')
const routes = require('./routes')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const flash = require('connect-flash')
const methodOverride = require('method-override')
const session = require('express-session')
const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = 'secret'
const passport = require('./config/passport')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const { getUser } = require('./helpers/auth-helpers')

app.engine('hbs', exphbs({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')

app.use(express.urlencoded({ extended: true }))

app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize()) // 增加這行，初始化 Passport
app.use(passport.session())// 增加這行，啟動 session 功能
app.use(flash()) // 掛載套件
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages') // 設定 success_msg 訊息
  res.locals.error_messages = req.flash('error_messages') // 設定 warning_msg 訊息
  res.locals.user = getUser(req)
  next()
})

app.use(routes)

app.listen(port, () => {
  console.info(`Example app listening on port ${port}!`)
})

module.exports = app
