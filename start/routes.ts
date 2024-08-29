/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import TasksController from "#controllers/tasks_controller";
import AuthController from "#controllers/auth_controller"

import { middleware } from '#start/kernel'


router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])

router
  .group(() => {
    router.post('/task', [TasksController, 'create'])
    router.get('/task/:id', [TasksController, 'show'])
    router.get('/tasks/user', [TasksController, 'index'])
    router.put('/task/:id', [TasksController, 'update'])
    router.delete('/task/:id', [TasksController, 'delete'])
    router.post('/logout', [AuthController, 'logout'])

  })
  .prefix('/api')
  .middleware([
    middleware.auth({
      guards: ['api']
    })
  ])
  
