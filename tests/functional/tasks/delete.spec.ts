import { test } from '@japa/runner'
import User from '#models/user'
import Task from '#models/task'
import { UserFactory } from '#database/factories/user/user_factory'
import { TaskFactory } from '#database/factories/task/task_factory'

test.group('Tasks delete', (group) => {
  let user: User
  let task: Task

  group.setup(async () => {
    await User.query().where('email', 'thiago@email.com').delete()

    user = await UserFactory.merge({
      email: 'thiago@email.com',
      password: '123456'
    }).create()

    task = await TaskFactory.merge({
      name: 'Task to delete',
      description: 'This task will be deleted',
      priority: 'low',
      status: 'pending',
      userId: user.id
    }).create()
    
  })

  test('should delete a task successfully', async ({ client, assert }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const response = await client
      .delete(`/api/task/${task.id}`)
      .header('Authorization', `Bearer ${token}`)
    
    response.assertStatus(204)

    const deletedTask = await Task.query().where('id', task.id).first()

    assert.isNull(deletedTask)
  })

  test('should return error for deleting non-existing task', async ({ client }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const nonExistingTaskId = 99999

    const response = await client
      .delete(`/api/task/${nonExistingTaskId}`)
      .header('Authorization', `Bearer ${token}`)
    
    response.assertStatus(404)
    response.assertBodyContains({
      message: 'Task not found or you are not authorized to delete this task'
    })
  })

  test('should return error for invalid task ID', async ({ client }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const response = await client
      .delete('/api/task/invalid-id')
      .header('Authorization', `Bearer ${token}`)
    
    response.assertStatus(400)
    response.assertBodyContains({
      message: 'Invalid Task Id'
    })
  })
})