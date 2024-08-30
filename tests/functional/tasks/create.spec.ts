import User from '#models/user'
import { test } from '@japa/runner'

test.group('Tasks create', (group) => {
  let user: User

  group.setup(async () => {
    
    await User.query().where('email', 'thiago@email.com').delete()

    
    user = await User.create({
      email: 'thiago@email.com',
      password: '123456',
    })
  })

  test('create a new task successfully', async ({ client, assert }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })
  
    const { token } = authResponse.body()
  
    const payload = {
      name: 'Desafio AdonisJs',
      description: 'Criar teste de integração do create task',
    }
  
    const response = await client
      .post('/api/task')
      .header('Authorization', `Bearer ${token}`)
      .json(payload)
  
    response.assertStatus(201)
    assert.isObject(response.body())
  })

  test('should return validation error when payload is invalid', async ({ client }) => {
    const authResponse = await client.post('/login').json({
      email: 'thiago@email.com',
      password: '123456',
    })

    const { token } = authResponse.body()

    const payload = {
      // Dados inválidos
    }

    const response = await client
      .post('/api/task')
      .header('Authorization', `Bearer ${token}`)
      .json(payload)

    response.assertStatus(422)
  })
})