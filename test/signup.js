const request = require('supertest')
const chai = require('chai')
const should = chai.should()

const app = require('../app')
const db = require('../models')

describe('# signup request', () => {
  before(async () => {
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
    await db.User.destroy({ where: { email: 'test1' } })
  })
})