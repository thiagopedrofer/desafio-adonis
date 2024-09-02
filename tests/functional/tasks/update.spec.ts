import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import {UserFactory} from '#database/factories/user/user_factory'
import {TaskFactory} from '#database/factories/task/task_factory'
import { TaskStatus } from '#enums/task'

test.group('Tasks update', (group) => {
  let user: User
  let task: Task

  group.setup(async () => {
    await User.query().where('email', 'thiago@email.com').delete()
    await Task.query().where('name', 'Test created task').delete()

    user = await UserFactory.merge({
      email: 'thiago@email.com',
      password: '123456'
    }).create()

    task = await TaskFactory.merge({
      name: 'Test created task',
      description: 'Created task',
      priority: 'low',
      userId: user.id,
      status: TaskStatus.Pending
    }).create()

  })

  test('update an existing task successfully', async ({ client, assert }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const updatedPayload = {
      name: 'Updated task name',
      description: 'Updated task description',
      priority: 'high',
      status: TaskStatus.Completed
    }
    
    const response = await client
      .put(`/api/task/${task.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json(updatedPayload)

    const responseData = response.body()

    const updatedTask = await Task.query().where('id', task.id).first()   

    response.assertStatus(200)
    assert.isObject(responseData)
    assert.equal(responseData.message, 'Task updates successfully')
    assert.equal(updatedPayload.name, updatedTask.name)
    assert.equal(updatedPayload.description, updatedTask.description)
    assert.equal(updatedPayload.priority, updatedTask.priority)
    assert.equal(updatedPayload.status, updatedTask.status)
  })

  test('should return validation error when payload is invalid', async ({ client }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const invalidPayload = {
      // Dados inválidos
    }

    const response = await client
      .put(`/api/task/${task.id}`)
      .header('Authorization', `Bearer ${token}`)
      .json(invalidPayload)

    const errors = response.body().errors

    response.assertStatus(422)
    response.assert.includeDeepMembers(errors, [
      { "message": "The name field must be defined", "rule": "required", "field": "name" }
    ])
  })
})