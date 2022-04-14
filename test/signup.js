const request = require('supertest')
const chai = require('chai')
const should = chai.should()
const sinon = require('sinon')

const app = require('../app')
const db = require('../models')
const User = db.User

describe('# signup request', () => {
  before(async () => {
    const user = { name: 'test1', email: 'test1', password: '1234', passwordCheck: '1234' }
    this.findOne = sinon.stub(User, 'findOne').resolves(null)
    this.create = sinon.stub(User, 'create').resolves({ ...user })
  })

  it('signup successfully', (done) => {
    request(app)
      .post('/api/signup')
      .send({ name: 'test1', email: 'test1', password: '1234', passwordCheck: '1234' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const status = res.body.status
        status.should.equal('success')
        return done()
      })
  })

  after(async () => {
    this.findOne.restore()
    this.create.restore()
  })
})