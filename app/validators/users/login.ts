import vine from '@vinejs/vine'

export const LoginValidator = vine.compile(
    vine.object({
      email: vine.string().email().normalizeEmail(),
      password: vine.string(),
    })
  )