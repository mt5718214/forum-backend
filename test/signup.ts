import request from 'supertest'
import sinon from 'sinon'
import { should } from 'chai'
should()

import app from '../app'

const db = require('../models')
const User = db.User

describe('# signup request', () => {
  let findOne, create
  before(async () => {
    const user = { name: 'test1', email: 'test1', password: '1234', passwordCheck: '1234' }
    findOne = sinon.stub(User, 'findOne').resolves(null)
    create = sinon.stub(User, 'create').resolves({ ...user })
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
    findOne.restore()
    create.restore()
  })
})