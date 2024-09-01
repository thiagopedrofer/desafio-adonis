import type { HttpContext } from '@adonisjs/core/http'
import TaskService from '#services/task_service';
import { TaskValidator } from '#validators/tasks/create';
import { TaskFilterValidator } from '#validators/tasks/task_filter';
import { inject } from '@adonisjs/core';
import _ from 'lodash';
import { TaskFilters } from '#interfaces/task_filter';

@inject()
export default class TasksController {

  constructor(private taskService: TaskService) {}

  public async create({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(TaskValidator)
    const task = await this.taskService.createTask(payload, auth.user.id);
    return response.status(201).json(task);
  }

  public async show({ params, auth, response }: HttpContext) {
    const taskId = Number(params.id);
  
    if (isNaN(taskId)) {
      return response.badRequest('Invalid task ID');
    }

    const task = await this.taskService.getTaskById(taskId, auth.user.id);

    if (!task) {
      return response.notFound('Task not found');
    }

    return response.json(task);
  }

  public async index({ auth, request, response }: HttpContext) {
    
    const filters =  await request.validateUsing(TaskFilterValidator) as TaskFilters

    const tasks = await this.taskService.getAllTasks(auth.user.id, filters)

    if (_.isEmpty(tasks)) {
      return response.json({ message: 'No tasks registered, or no tasks match the selected filters.' })
    }

    return response.json(tasks)
  }

  public async update({ request, params, response, auth }: HttpContext) {
    const taskId = Number(params.id);

    if (isNaN(taskId)) {
      return response.badRequest('Invalid task ID');
    }

    const payload = await request.validateUsing(TaskValidator);
    const task = await this.taskService.updateTask(taskId, payload, auth.user.id);

    if (!task) {
      return response.notFound('Task not found or you are not authorized to update this task');
    }

    return response.json(task);
  }
  
  public async delete({ params, response, auth }: HttpContext) {
    const taskId = Number(params.id);

    if (isNaN(taskId)) {
      return response.badRequest('Invalid task ID');
    }

    const isDeleted = await this.taskService.deleteTask(taskId, auth.user.id);

    if (!isDeleted) {
      return response.notFound('Task not found or you are not authorized to delete this task');
    }

    return response.noContent();
  }
}
