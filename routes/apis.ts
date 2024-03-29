import express, { Request, Response, Router, NextFunction } from 'express'
import passport from 'passport'

import { restController } from '../controllers/api/restController'
import { userController } from '../controllers/api/userController'
import { adminController } from '../controllers/api/adminController'
import { categoryController } from '../controllers/api/categoryController'
import { commentController } from '../controllers/api/commentController'

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const router: Router = express.Router()

interface authenticatedReq extends Request {
  user: {
    id: number
    name: string,
    email: string,
    password: string,
    isAdmin: boolean,
    image: string
  }
}

interface middleware {
  (req: authenticatedReq, res: Response, next: NextFunction): express.Response<any, Record<string, any>> | void
}

/**
 * https://github.com/jaredhanson/passport/blob/master/lib/authenticator.js line 141 to line 144
 * 可以把req, res, next傳入callback
 */
const authenticated: middleware = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, _info) => {
    if (err) {
      console.log(err)
    }
    if (!user) {
      return res
        .status(401)
        .json({ status: 'error', message: 'No auth token' })
    }
    req.user = user
    return next()
  })(req, res, next)
}
const authenticatedAdmin: middleware = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

router.get('/get_current_user', authenticated, userController.getCurrentUser)

router.get('/', authenticated, (_req, res) => res.redirect('/api/restaurants'))
router.get('/restaurants', authenticated, restController.getRestaurants)
router.get('/restaurants/feeds', authenticated, restController.getFeeds)
router.get('/restaurants/top', authenticated, restController.getTopRestaurants)
router.get('/restaurants/:id', authenticated, restController.getRestaurant)
router.get('/restaurants/:id/dashboard', authenticated, restController.getDashboard)

router.post('/comments', authenticated, commentController.postComment)
router.delete('/comments/:id', authenticated, authenticatedAdmin, commentController.deleteComment)

router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, upload.single('image'), userController.putUser)
router.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
router.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
router.post('/like/:restaurantId', authenticated, userController.addLike)
router.delete('/like/:restaurantId', authenticated, userController.removeLike)
router.post('/following/:userId', authenticated, userController.addFollowing)
router.delete('/following/:userId', authenticated, userController.removeFollowing)

router.get('/admin', authenticated, authenticatedAdmin, (_req, res) => res.redirect('/api/admin/restaurants'))
router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)
router.post('/admin/restaurants', authenticated, authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', authenticated, authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)

router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.put('/admin/users/:id', authenticated, authenticatedAdmin, adminController.putUsers)

router.get('/admin/categories', authenticated, authenticatedAdmin, categoryController.getCategories)
router.post('/admin/categories', authenticated, authenticatedAdmin, categoryController.postCategory)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.putCategory)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin, categoryController.deleteCategory)

// JWT signin
router.post('/signin', userController.signIn)
router.post('/signup', userController.signUp)

export default router