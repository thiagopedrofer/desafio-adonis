import { test } from '@japa/runner'
import User from '#models/user'
import Task from '#models/task'
import { UserFactory } from '#database/factories/user/user_factory'
import { TaskFactory } from '#database/factories/task/task_factory'

test.group('Tasks show', (group) => {
  let user: User
  let task: Task

  group.setup(async () => {
    await User.query().where('email', 'thiago@email.com').delete()

    user = await UserFactory.merge({
      email: 'thiago@email.com',
      password: '123456'
    }).create()

    task = await TaskFactory.merge({
      name: 'Test Task',
      description: 'Task Description',
      priority: 'low',
      userId: user.id
    }).create()

    
  })

  test('should show a task successfully', async ({ client, assert }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const response = await client
      .get(`/api/task/${task.id}`)
      .header('Authorization', `Bearer ${token}`)
    
    const responseData = response.body()

    response.assertStatus(200)
    assert.isObject(responseData)
    assert.equal(responseData.id, task.id)
    assert.equal(responseData.name, task.name)
    assert.equal(responseData.description, task.description)
    assert.equal(responseData.priority, task.priority)
    assert.equal(responseData.userId, task.userId)
  })

  test('should return error for non-existing task', async ({ client }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const nonExistingId = 9999

    const response = await client
      .get(`/api/task/${nonExistingId}`)
      .header('Authorization', `Bearer ${token}`)
    
    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Task not found'
    })
  })

  test('should return error for invalid taskId', async ({ client }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const invalidTaskId = 'asd'

    const response = await client
      .get(`/api/task/${invalidTaskId}`)
      .header('Authorization', `Bearer ${token}`)
    
    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Invalid Task Id'
    })
  })
})