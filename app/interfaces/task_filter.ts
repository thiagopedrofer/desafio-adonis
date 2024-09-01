export interface TaskFilters {
    status?: 'pending' | 'in_progress' | 'completed';
    priority?: 'low' | 'medium' | 'high';
    orderBy?: 'created_at' | 'priority' | 'status';
    sortDirection?: 'asc' | 'desc'
  }
  