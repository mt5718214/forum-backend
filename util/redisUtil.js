const { createClient } = require('redis');

/**
 * 寫入
 * @param {string} key 
 * @param {any} value 
 * @returns 
 */
const setData = async (key, value) => {
  const client = createClient({
    url: 'redis://localhost:6379'
  })

  client.on('error', (err) => console.log('Redis Client Error', err))

  await client.connect()
  await client.set(key, value)
  await client.quit()
  return true
}

/**
 * 讀取
 * @param {string} key 
 * @returns {Promise<any>}
 */
const getData = async (key) => {
  const client = createClient({
    url: 'redis://localhost:6379'
  })

  client.on('error', (err) => console.log('Redis Client Error', err))

  await client.connect()
  const value = await client.get(key)
  await client.quit()
  return value
}

/**
 * 刪除
 * @param {string} key 
 * @returns 
 */
const deleteData = async (key) => {
  const client = createClient({
    url: 'redis://localhost:6379'
  })

  client.on('error', (err) => console.log('Redis Client Error', err))

  await client.connect()
  await client.del(key)
  await client.quit()

  return true
}

module.exports = {
  setData,
  getData,
  deleteData
}