import User from '#models/user'
import { test } from '@japa/runner'
import {UserFactory} from '#database/factories/user/user_factory'
import Task from '#models/task'
import { TaskStatus } from '#enums/task'

test.group('Tasks create', (group) => {
  let user: User

  group.setup(async () => {
    
    await User.query().where('email', 'thiago@email.com').delete()

    user = await UserFactory.merge({
      email: 'thiago@email.com',
      password: '123456'
    }).create()
  })

  test('create a new task successfully', async ({ client, assert }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })
  
    const { token } = authResponse.body()
  
    const payload = {
      name: 'Test created task',
      description: 'Created task',
      priority:'low'
    }
  
    const response = await client
      .post('/api/task')
      .header('Authorization', `Bearer ${token}`)
      .json(payload)
    
    const responseData = response.body()

    const task = await Task.query().where('id', responseData.id).first()

    const defaultStatus = TaskStatus.Pending
  
    response.assertStatus(201)
    assert.isObject(responseData)
    assert.equal(responseData.id, task.id)
    assert.equal(responseData.name, task.name)
    assert.equal(responseData.description, task.description)
    assert.equal(responseData.priority, task.priority)
    assert.equal(defaultStatus, task.status)
    assert.equal(responseData.userId, task.userId)
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

    const errors = response.body().errors

    response.assertStatus(422)
    response.assert.includeDeepMembers(errors, [
      { "message": "The name field must be defined", "rule": "required", "field": "name" }
    ])
    response.assert.includeDeepMembers(errors, [
      { "message": "The priority field must be defined", "rule": "required", "field": "priority" }
    ])
  })
})