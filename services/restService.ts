const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

const pageLimit = 10

export const restService = {
  getRestaurants: (req, _res, callback) => {
    let offset = 0
    let whereQuery = {}
    let categoryId: number
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({ include: Category, where: whereQuery, offset: offset, limit: pageLimit }).then(result => {
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map((_item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1

      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description ? r.dataValues.description.substring(0, 50) : '',
        isFavorited: req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(d => d.id).includes(r.id) : false,
        isLiked: req.user?.LikedRestaurants ? req.user.LikedRestaurants.map(d => d.id).includes(r.id) : false
      }))
      Category.findAll().then(categories => {
        return callback({
          restaurants: data,
          categories,
          categoryId,
          page,
          totalPage,
          prev,
          next
        })
      })
    })
  },
  getRestaurant: (req, _res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: User, as: 'FavoritedUsers' },
        { model: User, as: 'LikedUsers' },
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      restaurant.viewCounts += 1
      restaurant.save()
        .then(restaurant => {
          const isFavorited = restaurant.FavoritedUsers.map(d => d.id).includes(req.user.id)
          const isLiked = restaurant.LikedUsers.map(d => d.id).includes(req.user.id)
          callback({
            restaurant,
            isFavorited,
            isLiked
          })
        })
    })
  },
  getFeeds: (_req, _res, callback) => {
    return Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category]
    }).then(restaurants => {
      Comment.findAll({
        limit: 10,
        order: [['createdAt', 'DESC']],
        include: [User, Restaurant]
      }).then(comments => {
        callback({
          restaurants,
          comments
        })
      })
    })
  },
  getDashboard: (req, _res, callback) => {
    return Restaurant.findByPk(req.params.id, {
      include: [
        Category,
        { model: Comment, include: [User] }
      ]
    }).then(restaurant => {
      return callback({ restaurant })
    })
  },
  getTopRestaurants: (req, _res, callback) => {
    return Restaurant.findAll({
      include: [
        { model: User, as: 'FavoritedUsers' }
      ]
    }).then(restaurants => {
      restaurants = restaurants.map(d => (
        {
          ...d.dataValues,
          description: d.dataValues.description ? d.dataValues.description.substring(0, 50) : '',
          isFavorited: req.user?.FavoritedRestaurants ? req.user.FavoritedRestaurants.map(d => d.id).includes(d.id) : false,
          FavoriteCount: d.dataValues.FavoritedUsers.length
        }
      ))
      restaurants = restaurants.sort((a, b) => a.FavoriteCount < b.FavoriteCount ? 1 : -1).slice(0, 10)

      return callback({
        restaurants,
        isAuthenticated: req.isAuthenticated
      })
    })
  }
}
