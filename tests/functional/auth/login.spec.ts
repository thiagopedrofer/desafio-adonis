import { test } from '@japa/runner'
import {UserFactory} from '#database/factories/user/user_factory'

test.group('Auth login', () => {
  test('should log in successfully with valid credentials', async ({ client, assert }) => {
    
    const user = await UserFactory.merge({
      email: 'login@email.com',
      password: '123456'
    }).create()

    const response = await client.post('/login').json({
      email: user.email,
      password: '123456',
    });

    response.assertStatus(200);
    const token = response.body().token;

    assert.exists(token, 'Token should be returned');
    assert.isString(token);
  });

  test('should return an error when credentials are invalid', async ({ client, assert }) => {
    
    const response = await client.post('/login').json({
      email: 'invalid@example.com',
      password: 'invalidPassword',
    });

    response.assertStatus(400);
    const errors = response.body().errors;

    assert.equal(errors[0].message, 'Invalid user credentials');
  });
});