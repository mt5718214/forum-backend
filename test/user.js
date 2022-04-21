const request = require('supertest')
const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const sinon = require('sinon')

const app = require('../app')
const db = require('../models')
const Category = db.Category
const Restaurant = db.Restaurant
const Comment = db.Comment
const passport = require('../config/passport')

describe('# user request', () => {

  context('# restaurant', () => {

    describe('GET /api/restaurants', () => {
      before(async () => {
        const rootUser = { name: 'root' }
        /**
         * yields方法可以讓給定的method中的callback執行, 而不去執行method中的其他邏輯
         * 這個寫法也可以 this.authenticate = sinon.stub(passport, 'authenticate').returns(() => { }).yields(null, { id: 1 })
         * 
         * https://techbrij.com/nodejs-sinon-stub-passport-authenticate
         */
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null)
          return (req, res, next) => { }
        })
        this.Restaurant = sinon.stub(Restaurant, 'findAndCountAll').resolves({
          rows: [{ dataValues: { name: 'Restaurant', createdAt: new Date(), updatedAt: new Date(), CategoryId: 1 } }]
        })
        this.Category = sinon.stub(Category, 'findAll').resolves([1, 2, 3, 4, 5, 6, 7])
      })

      it(' - successfully', (done) => {
        request(app)
          .get('/api/restaurants')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.text).to.include('Restaurant')
            return done()
          })
      })

      after(async () => {
        /**
         * The original function can be restored by calling object.method.restore(); (or stub.restore();).
         * 這邊使用this.authenticate變數儲存,以便在after中call restore()
         * 如果使用const或var會因為塊級區域導致after中找不到該變數, 或是可以把authenticate變數宣告在before之前
         **/
        this.authenticate.restore()
        this.Restaurant.restore()
        this.Category.restore()
      })
    })

    describe('GET /api/restaurants/feeds', () => {
      before(async () => {
        const rootUser = { name: 'root' }
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null)
          return (req, res, next) => { }
        })
        this.Restaurant = sinon.stub(Restaurant, 'findAll').resolves([
          { "id": 1, "name": "Restaurant", "tel": "(304) 806-3705 x90615", "address": "110 Gislason Parkways" }
        ])
        this.Comment = sinon.stub(Comment, 'findAll').resolves([
          { "id": 1, "text": "testText", "UserId": 1, "RestaurantId": 1 }
        ])
      })

      it(' - successfully', (done) => {
        request(app)
          .get('/api/restaurants/feeds')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.text).to.include('Restaurant')
            expect(res.text).to.include('testText')
            return done()
          })
      })

      after(async () => {
        this.authenticate.restore()
        this.Restaurant.restore()
        this.Comment.restore()
      })
    })

    describe('GET /restaurants/top', () => {
      before(async () => {
        const rootUser = { name: 'root' }
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null)
          return (req, res, next) => { }
        })
        this.Restaurant = sinon.stub(Restaurant, 'findAll').resolves([
          { dataValues: { "id": 1, "name": "Restaurant", "tel": "(304) 806-3705 x90615", "address": "110 Gislason Parkways", "FavoritedUsers": [] } },
          { dataValues: { "id": 2, "name": "Restaurant2", "tel": "(304) 806-3705 x90615", "address": "110 Gislason Parkways", "FavoritedUsers": [] } }
        ])
      })

      it(' - successfully', (done) => {
        request(app)
          .get('/api/restaurants/top')
          .set('Accept', 'application/json')
          .expect(200)
          .end((err, res) => {
            if (err) return done(err)
            expect(res.body).to.be.an('object')
            expect(res.body.restaurants).to.be.an('array')
            expect(res.text).to.include('Restaurant2')
            return done()
          })
      })

      after(async () => {
        this.authenticate.restore()
        this.Restaurant.restore()
      })
    })

    // describe('GET /restaurants/:id', () => {
    //   before(async () => {
    //     const rootUser = { name: 'root' }
    //     this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
    //       callback(null, { ...rootUser }, null)
    //       return (req, res, next) => { }
    //     })
    //     this.Restaurant = sinon.stub(Restaurant, 'findByPk').resolves({
    //       name: 'Restaurant', createdAt: new Date(), updatedAt: new Date(), CategoryId: 1, FavoritedUsers: [], LikedUsers: []
    //     })
    //     // save() 待解決
    //     this.Restaurant = sinon.stub(Restaurant, 'save').resolves({
    //       name: 'Restaurant', createdAt: new Date(), updatedAt: new Date(), CategoryId: 1, FavoritedUsers: [], LikedUsers: []
    //     })
    //   })

    //   it(' - successfully', (done) => {
    //     request(app)
    //       .get('/api/restaurants/1')
    //       .set('Accept', 'application/json')
    //       .expect(200)
    //       .end((err, res) => {
    //         if (err) return done(err)
    //         expect(res.text).to.include('Restaurant')
    //         return done()
    //       })
    //   })

    //   after(async () => {
    //     this.authenticate.restore()
    //     this.Restaurant.restore()
    //   })
    // })

  })

})