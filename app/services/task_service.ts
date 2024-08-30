import TaskRepository from '#repositories/task_repository';
import { inject } from '@adonisjs/core';
import { TaskPayload } from '#interfaces/task';

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
    return await this.taskRepository.findById(taskId, userId);
  }

  public async getAllTasks(userId: number) {
    return await this.taskRepository.findAllByUserId(userId);
  }

  public async updateTask(taskId: number, payload: TaskPayload, userId: number) {
    const task = await this.taskRepository.findById(taskId, userId);
    if (task) {
      return await this.taskRepository.update(taskId, payload);
    }
    return null;
  }

  public async deleteTask(taskId: number, userId: number) {
    const task = await this.taskRepository.findById(taskId, userId);
    if (task) {
      return await this.taskRepository.delete(taskId);
    }
    return false;
  }
}