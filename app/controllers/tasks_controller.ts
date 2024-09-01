import type { HttpContext } from '@adonisjs/core/http'
import TaskService from '#services/task_service';
import { CreateTaskValidator } from '#validators/tasks/create';
import { UpdateTaskValidator } from '#validators/tasks/update';
import { TaskFilterValidator } from '#validators/tasks/task_filter';
import { inject } from '@adonisjs/core';
import { TaskFilters } from '#interfaces/task_filter';

@inject()
export default class TasksController {

  constructor(private taskService: TaskService) {}

  public async create({ request, auth, response }: HttpContext) {

    const payload = await request.validateUsing(CreateTaskValidator)

    const task = await this.taskService.createTask(payload, auth.user.id);

    return response.status(201).json(task);
  }

  public async show({ params, auth, response }: HttpContext) {

    const taskId = Number(params.id);
  
    const task = await this.taskService.getTaskById(taskId, auth.user.id);

    return response.json(task);
  }

  public async index({ auth, request, response }: HttpContext) {
    
    const filters =  await request.validateUsing(TaskFilterValidator) as TaskFilters

    const tasks = await this.taskService.getAllTasks(auth.user.id, filters)

    return response.json(tasks);
  }

  public async update({ request, params, response, auth }: HttpContext) {

    const taskId = Number(params.id);
    const payload = await request.validateUsing(UpdateTaskValidator);
    
    const task = await this.taskService.updateTask(taskId, payload, auth.user.id);

    return response.json(task);
  }
  
  public async delete({ params, response, auth }: HttpContext) {
    const taskId = Number(params.id);

    await this.taskService.deleteTask(taskId, auth.user.id);    

    return response.noContent();
  }
}
