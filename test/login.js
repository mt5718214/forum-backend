const chai = require('chai')
const should = chai.should()
const request = require('supertest')
const bcrypt = require('bcryptjs')
const sinon = require('sinon')

const app = require('../app')
const db = require('../models')
const User = db.User

describe('# login request', () => {
  before(async () => {
    const user = {
      name: 'test1',
      email: 'test1',
      password: bcrypt.hashSync('test1', bcrypt.genSaltSync(10)),
    }
    this.create = sinon.stub(User, 'create').returns(user)
    this.findOne = sinon.stub(User, 'findOne').resolves({ ...user })
  })

  it('login fail', (done) => {
    request(app)
      .post('/api/signin')
      .send('')
      .end((err, res) => {
        if (err) return done(err)
        const status = res.body.status
        status.should.equal('error')
        return done()
      })
  })

  it('login successfully', (done) => {
    request(app)
      .post('/api/signin')
      .send({ email: 'test1', password: 'test1' })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        const token = res.body.token
        const message = res.body.message
        const status = res.body.status
        token.should.not.equal(undefined)
        message.should.equal('ok')
        status.should.equal('success')
        return done()
      })
  })

  after(async () => {
    this.create.restore()
    this.findOne.restore()
  })
})