import passport from 'passport'
import LocalStrategy from 'passport-local' 
import bcrypt from 'bcryptjs'
const db = require('../models')
const User = db.User

interface serializeUser extends Express.User {
  id: number
}

// setup passport strategy
passport.use(new LocalStrategy.Strategy(
  // customize user field
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  // authenticate user
  (req: any, username: string, password: string, cb) => {
    console.log("LocalStrategy");
    
    User.findOne({ where: { email: username } }).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user
passport.serializeUser((user: serializeUser, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
    include: [
      { model: db.Restaurant, as: 'FavoritedRestaurants' },
      { model: db.Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    return cb(null, user)
  })
})

// JWT
import passportJWT, { JwtFromRequestFunction } from 'passport-jwt'
const ExtractJwt = passportJWT.ExtractJwt
const JwtStrategy = passportJWT.Strategy

interface jwtOptions {
  jwtFromRequest: JwtFromRequestFunction
  secretOrKey: string | undefined
}

let jwtOptions: jwtOptions = {
  jwtFromRequest: function () {
    throw new Error('Function not implemented.')
  },
  secretOrKey: undefined
}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
jwtOptions.secretOrKey = process.env.JWT_SECRET

passport.use(new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  User.findByPk(jwt_payload.id, {
    include: [
      { model: db.Restaurant, as: 'FavoritedRestaurants' },
      { model: db.Restaurant, as: 'LikedRestaurants' },
      { model: User, as: 'Followers' },
      { model: User, as: 'Followings' }
    ]
  }).then(user => {
    if (!user) return next(null, false)
    return next(null, user)
  })
}))

export default passport
