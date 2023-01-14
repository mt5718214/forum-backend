const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Comment = db.Comment
const Favorite = db.Favorite
const Like = db.Like
const Followship = db.Followship

const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

export const userService = {
  getUser: (req, _res, callback) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Comment, include: Restaurant },
        { model: Restaurant, as: 'FavoritedRestaurants' },
        { model: User, as: 'Followers' },
        { model: User, as: 'Followings' }
      ]
    }).then(user => {
      user.CommentsRestaurants = []
      user.Comments.map((comment) => {
        if (!user.CommentsRestaurants.map(d => d.id).includes(comment.RestaurantId)) {
          user.CommentsRestaurants.push(comment.Restaurant)
          return comment
        }
      })
      const isFollowed = req.user.Followings.map(d => d.id).includes(user.id)
      callback({ profile: user, isFollowed: isFollowed })
    })
  },
  putUser: (req, _res, callback) => {
    if (Number(req.params.id) !== Number(req.user.id)) {
      return callback({ status: 'error', message: 'permission denied' })
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (_err, img) => {
        return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
              image: img.data.link
            }).then(() => {
              return callback({ status: 'success', message: 'updated successfully' })
            })
          })
      })
    } else {
      return User.findByPk(req.params.id)
        .then((user) => {
          user.update({
            name: req.body.name
          }).then(() => {
            return callback({ status: 'success', message: 'updated successfully' })
          })
        })
    }
  },
  addFavorite: (req, _res, callback) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
      .then(() => {
        return callback({ status: 'success', message: '' })
      })
  },

  removeFavorite: (req, _res, callback) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
      .then((favorite) => {
        favorite.destroy()
          .then(() => {
            return callback({ status: 'success', message: '' })
          })
      })
  },
  addLike: (req, _res, callback) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    }).then(() => {
      return callback({ status: 'success', message: '' })
    })
  },

  removeLike: (req, _res, callback) => {
    return Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    }).then((like) => {
      like.destroy()
        .then(() => {
          return callback({ status: 'success', message: '' })
        })
    })
  },
  getTopUser: (req, _res, callback) => {
    return User.findAll({
      include: [
        { model: User, as: 'Followers' }
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues,
        FollowerCount: user.Followers.length,
        isFollowed: req.user.Followings ? req.user.Followings.map(d => d.id).includes(user.id) : false
      }))
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      callback({ users: users })
    })
  },
  addFollowing: (req, _res, callback) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
      .then(() => {
        return callback({ status: 'success', message: '' })
      })
  },

  removeFollowing: (req, _res, callback) => {
    return Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId
      }
    })
      .then((followship) => {
        followship.destroy()
          .then(() => {
            return callback({ status: 'success', message: '' })
          })
      })
  }
}
