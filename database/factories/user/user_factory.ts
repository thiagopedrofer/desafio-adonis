import factory from '@adonisjs/lucid/factories'
import User from '#models/user'

export const UserFactory = factory.define(User, ({ faker }) => {
  return {
    full_name: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  }
}).build()