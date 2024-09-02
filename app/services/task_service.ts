import TaskRepository from '#repositories/task_repository';
import { inject } from '@adonisjs/core';
import { TaskPayload } from '#interfaces/task';
import { TaskFilters } from '#interfaces/task_filter';
import NotFoundException from '#exceptions/not_found_exception';
import BadRequestException from '#exceptions/bad_request_exception';
import _ from 'lodash';

@inject()

export default class TaskService {
  constructor(
    private taskRepository: TaskRepository
  ) {}

  public async createTask(payload: TaskPayload, userId: number) {
    payload.user_id = userId;
    return await this.taskRepository.create(payload);
  }

  public async getTaskById(taskId: number, userId: number) {

    if (isNaN(taskId)) {
      throw new BadRequestException('Invalid Task Id');
    }

    const task = await this.taskRepository.findById(taskId, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  public async getAllTasks(userId: number, filters: TaskFilters) {

    const tasks = await this.taskRepository.findAllByUserId(userId, filters);

    if (_.isEmpty(tasks)) {
      throw new NotFoundException('No tasks registered, or no tasks match the selected filters.')
    }

    return tasks;
  }

  public async updateTask(taskId: number, payload: TaskPayload, userId: number) {

    if (isNaN(taskId)) {
      throw new BadRequestException('Invalid Task Id');
    }

    const task = await this.taskRepository.findById(taskId, userId);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskRepository.update(taskId, payload, userId);

    return {'message':'Task updates successfully'};
    
  }

  public async deleteTask(taskId: number, userId: number) {

    if (isNaN(taskId)) {
      throw new BadRequestException('Invalid Task Id');
    }

    const task = await this.taskRepository.findById(taskId, userId);

    if (!task) {
      throw new NotFoundException('Task not found or you are not authorized to delete this task');
    }
    
    return await this.taskRepository.delete(taskId);
    
  }
}