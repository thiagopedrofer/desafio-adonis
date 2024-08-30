import type { HttpContext } from '@adonisjs/core/http'
import TaskService from '#services/task_service';
import { CreateTaskValidator } from '#validators/tasks/create';

export default class TasksController {

  private taskService = new TaskService();

  public async create({ request, auth, response }: HttpContext) {
    const payload = await request.validateUsing(CreateTaskValidator)
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

  public async index({ auth, response }: HttpContext) {
    const tasks = await this.taskService.getAllTasks(auth.user.id);

    if (tasks.length === 0) {
      return response.json({ message: 'You have no tasks registered' });
    }

    return response.json(tasks);
  }

  public async update({ request, params, response, auth }: HttpContext) {
    const taskId = Number(params.id);

    if (isNaN(taskId)) {
      return response.badRequest('Invalid task ID');
    }

    const payload = await request.validateUsing(CreateTaskValidator);
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
