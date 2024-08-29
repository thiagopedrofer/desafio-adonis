import type { HttpContext } from '@adonisjs/core/http'
import Task from "#models/task";
import { CreateTaskValidator } from '#validators/tasks/create';

export default class TasksController {

  async create({ request, auth, response }: HttpContext){

    const payload = await request.validateUsing(CreateTaskValidator)

    payload.user_id = auth.user.id

    const task = await Task.create(payload)

    return response.status(201).json(task)
  }

  async show({ params, auth, response }: HttpContext) {

    const taskId = params.id
  
    if (isNaN(Number(taskId))) {
      return response.badRequest('Invalid task id')
    }

    const task = await Task.query().where('id', taskId).andWhere('user_id', auth.user.id).first()

    if (!task) {
      return response.notFound('Task not found')
    }

    return response.json(task)

  }

  async index({ auth, response }: HttpContext) {

    const userId = auth.user.id

    const tasks = await Task.query().where('user_id', userId)

    if (tasks.length === 0) {
      return response.json({ message: 'You have no tasks registered' })
    }

    return response.json(tasks)
  }

  async update({ request, params, response, auth }: HttpContext) {

    const taskId = params.id

    if (isNaN(Number(taskId))) {
      return response.badRequest('Invalid task id')
    }

    const payload = await request.validateUsing(CreateTaskValidator)

    const task = await Task.find(taskId)

    if (!task) {
      return response.notFound('Task not found')
    }
    
    if (task.userId !== auth.user.id) {
      return response.forbidden('You are not authorized to update this task')
    }

    task.merge(payload)
    await task.save()

    return response.json(task)
  }
  
  async delete({ params, response, auth }: HttpContext) {
    const taskId = params.id
  
    if (isNaN(Number(taskId))) {
      return response.badRequest('Invalid task id')
    }
  
    const task = await Task.query()
      .where('id', taskId)
      .andWhere('user_id', auth.user.id)
      .first()
  
    if (!task) {
      return response.notFound('Task not found or you are not authorized to delete this task')
    }
  
    await task.delete()
  
    return response.noContent()
  }

}
