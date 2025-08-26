import zod from 'zod'

export const signInSchema=zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
})
export type SignIn = zod.infer<typeof signInSchema>

export const signUpSchema=zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
    name: zod.string().optional(),
})
export type SignUp = zod.infer<typeof signUpSchema>

export const postSchema=zod.object({
    title: zod.string().min(1),
    content: zod.string().min(1),
})
export type Post = zod.infer<typeof postSchema>

export const updatePostSchema=zod.object({
    id: zod.string().min(1),
    title: zod.string().min(1),
    content: zod.string().min(1),
})
export type UpdatePost = zod.infer<typeof updatePostSchema>

export const deletePostSchema=zod.object({
    id: zod.string().min(1),
})
export type DeletePost = zod.infer<typeof deletePostSchema>
