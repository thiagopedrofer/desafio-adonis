import { TaskPriority, TaskStatus } from "../enums/task";

export interface TaskPayload {
    name: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority
}