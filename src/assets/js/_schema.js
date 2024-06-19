import * as v from 'valibot'

export const FirstNameSchema = v.pipe(v.string(), v.nonEmpty('First Name cannot be empty'))
export const LastNameSchema = v.pipe(v.string(), v.nonEmpty('Last Name cannot be empty'))
export const PasswordSchema = v.pipe(v.string(), v.nonEmpty('Password cannot be empty'))
export const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Email cannot be empty'),
  v.email('Looks like this is not an email')
)

export const FormSchema = v.object({
  firstName: FirstNameSchema,
  lastName: LastNameSchema,
  email: EmailSchema,
  password: PasswordSchema
})
