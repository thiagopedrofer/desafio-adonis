import { test } from '@japa/runner'
import User from '#models/user'

test.group('AuthController Register', () => {
  test('should register a new user successfully', async ({ client, assert }) => {
    const payload = {
      fullName: 'Thiago Andrade',
      email: 'register@email.com',
      password: '123456',
    }

    const response = await client
      .post('/register')
      .json(payload)

    const responseData = response.body()

    const user = await User.query().where('email', payload.email).first()

    response.assertStatus(201)
    assert.isObject(responseData)
    assert.equal(responseData.fullName, payload.fullName)
    assert.equal(responseData.email, payload.email)
    assert.exists(user)
  })

  test('should return validation error when email is not provided', async ({ client, assert }) => {
    const invalidPayload = {
      fullName: 'Thiago Andrade',
      password: '123456',
    }
  
    const response = await client.post('/register').json(invalidPayload)
  
    const errors = response.body().errors
  
    response.assertStatus(422)
  
    assert.equal(errors[0].message, 'The email field must be defined')
    assert.equal(errors[0].rule, 'required')
    assert.equal(errors[0].field, 'email')
  })
})