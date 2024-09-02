import { test } from '@japa/runner'
import User from '#models/user'
import Task from '#models/task'
import { UserFactory } from '#database/factories/user/user_factory'
import { TaskFactory } from '#database/factories/task/task_factory'

test.group('Tasks index', (group) => {
  let user: User
  let task1: Task
  let task2: Task
  let task3: Task

  group.setup(async () => {
    await User.query().where('email', 'thiago@email.com').delete()

    user = await UserFactory.merge({
      email: 'thiago@email.com',
      password: '123456'
    }).create()

    task1 = await TaskFactory.merge({
      name: 'Task 1',
      description: 'Description 1',
      priority: 'low',
      status: 'pending',
      userId: user.id
    }).create()

    task2 = await TaskFactory.merge({
      name: 'Task 2',
      description: 'Description 2',
      priority: 'medium',
      status: 'in_progress',
      userId: user.id
    }).create()

    task3 = await TaskFactory.merge({
      name: 'Task 3',
      description: 'Description 3',
      priority: 'high',
      status: 'completed',
      userId: user.id
    }).create()
  })

  test('should list tasks with filters', async ({ client, assert }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const response = await client
      .get('/api/tasks/user')
      .header('Authorization', `Bearer ${token}`)
      .qs({
        status: 'pending',
        priority: 'low',
        orderBy: 'created_at',
        sortDirection: 'desc'
      })
    
    const responseData = response.body()

    response.assertStatus(200)
    assert.isArray(responseData)
    assert.equal(responseData.length, 1)
    assert.equal(responseData[0].id, task1.id)
    assert.equal(responseData[0].name, task1.name)
    assert.equal(responseData[0].priority, task1.priority)
  })

  test('should return empty array for no matching tasks', async ({ client, assert }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const response = await client
      .get('/api/tasks/user')
      .header('Authorization', `Bearer ${token}`)
      .qs({
        status: 'completed',
        priority: 'low'
      })
    
    const responseData = response.body()

    response.assertStatus(404)
    assert.equal(responseData.message, "No tasks registered, or no tasks match the selected filters.")
  })

  test('should return validation error for invalid filters', async ({ client }) => {
    const authResponse = await client.post('/login').json({
      email: user.email,
      password: '123456',
    })

    const { token } = authResponse.body()

    const response = await client
      .get('/api/tasks/user')
      .header('Authorization', `Bearer ${token}`)
      .qs({
        status: 'invalid_status',
        priority: 'low'   
      })
    
    response.assertStatus(422)
    response.assertBodyContains({
       "errors": [
          {
            "message": "The selected status is invalid",
            "rule": "enum",
            "field": "status",
            "meta": {
              "choices": [
                "pending",
                "in_progress",
                "completed"
              ]
            }
          }
        ]
    })
  })
})