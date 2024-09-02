import factory from '@adonisjs/lucid/factories'
import Task from '#models/task'
import {UserFactory} from '#database/factories/user/user_factory'

export const TaskFactory = factory
  .define(Task, async ({ faker }) => {

    const user = await UserFactory.create();
    return {
      name: faker.lorem.word(),
      description: faker.lorem.sentence(),
      status: faker.helpers.arrayElement(['pending', 'in_progress', 'completed']),
      priority: faker.helpers.arrayElement(['low', 'medium', 'high']),
      userId:user.id
    }
  })
  .build()