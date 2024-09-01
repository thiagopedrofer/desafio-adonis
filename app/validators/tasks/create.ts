import vine from '@vinejs/vine'

export const CreateTaskValidator = vine.compile(
  vine.object({
    name: vine.string().trim().minLength(3),
    description: vine.string().optional(),
    status: vine.enum(['pending', 'in_progress', 'completed']).optional(),
    priority: vine.enum(['low', 'medium', 'high'])
  })
)