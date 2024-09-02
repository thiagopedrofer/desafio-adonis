import { test } from '@japa/runner'
import User from '#models/user'
import {UserFactory} from '#database/factories/user/user_factory'

test.group('Auth logout', (group) => {
  let user: User
  let token: string

  group.setup(async () => {
  
    await User.query().where('email', 'thiago@email.com').delete()

    user = await UserFactory.merge({
      email: 'thiago@email.com',
      password: '123456'
    }).create()

  })

  test('should log out successfully', async ({ client, assert }) => {
    
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const response = await client
      .post('/api/logout')
      .header('Authorization', `Bearer ${token}`)
    
    const responseData = response.body()

    response.assertStatus(200)
    assert.isObject(responseData)
    assert.equal(responseData.message, 'logout success')
  })
})