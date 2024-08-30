import TaskRepository from '#repositories/task_repository';

export default class TaskService {
  private taskRepository = new TaskRepository();

  public async createTask(payload: any, userId: number) {
    payload.user_id = userId;
    return await this.taskRepository.create(payload);
  }

  public async getTaskById(taskId: number, userId: number) {
    return await this.taskRepository.findById(taskId, userId);
  }

  public async getAllTasks(userId: number) {
    return await this.taskRepository.findAllByUserId(userId);
  }

  public async updateTask(taskId: number, payload: any, userId: number) {
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