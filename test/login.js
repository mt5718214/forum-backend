const chai = require('chai')
const should = chai.should()
const request = require('supertest')
const bcrypt = require('bcryptjs')

const app = require('../app')
const db = require('../models')

describe('# login request', () => {
  before(async () => {
    await db.User.create({
      name: 'test1',
      email: 'test1',
      password: bcrypt.hashSync('test1', bcrypt.genSaltSync(10)),
    })
  })

  it('login fail', (done) => {
    request(app)
      .post('/api/signin')
      .send('')
      .end((err, res) => {
        if (err) return done(err)
        console.log('res', res.body.token)
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
    await db.User.destroy({ where: { name: 'test1' } })
  })
})