import Task from '#models/task';
import { TaskPayload } from '#interfaces/task';
import { TaskFilters } from '../interfaces/task_filter';


export default class TaskRepository {
  public async create(payload: TaskPayload) {
    return await Task.create(payload);
  }

  public async findById(taskId: number, userId: number) {
    return await Task.query().where('id', taskId).andWhere('user_id', userId).first();
  }

  public async findAllByUserId(userId: number, filters: TaskFilters = {}) {
    const query = Task.query().where('user_id', userId);
  
    query.if(filters.status, (query) => {
      query.andWhere('status', filters.status);
    });
  
    query.if(filters.priority, (query) => {
      query.andWhere('priority', filters.priority);
    });
  
    query.if(filters.orderBy, (query) => {
      query.orderBy(filters.orderBy, filters.sortDirection || 'asc');
    }, (query) => {
    
      query.orderBy('created_at', 'asc');
    });
  
    return await query;
  }

  public async update(taskId: number, payload: TaskPayload) {
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