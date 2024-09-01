import vine from '@vinejs/vine'

export const TaskFilterValidator = vine.compile(
    vine.object({
      status: vine.enum(['pending', 'in_progress', 'completed']).optional(),
      priority: vine.enum(['low', 'medium', 'high']).optional(),
      orderBy: vine.enum(['created_at', 'priority', 'status']).optional(),
      sortDirection: vine.enum(['asc', 'desc']).optional(),
    })
  )