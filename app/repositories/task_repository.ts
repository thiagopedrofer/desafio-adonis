import Task from '#models/task';

export default class TaskRepository {
  public async create(payload: any) {
    return await Task.create(payload);
  }

  public async findById(taskId: number, userId: number) {
    return await Task.query().where('id', taskId).andWhere('user_id', userId).first();
  }

  public async findAllByUserId(userId: number) {
    return await Task.query().where('user_id', userId);
  }

  public async update(taskId: number, payload: any) {
    const task = await Task.find(taskId);
    if (task) {
      task.merge(payload);
      await task.save();
      return task;
    }
    return null;
  }

  public async delete(taskId: number) {
    const task = await Task.find(taskId);
    if (task) {
      await task.delete();
      return true;
    }
    return false;
  }
}