import zod from 'zod';
export declare const signInSchema: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
}, zod.core.$strip>;
export type SignIn = zod.infer<typeof signInSchema>;
export declare const signUpSchema: zod.ZodObject<{
    email: zod.ZodString;
    password: zod.ZodString;
    name: zod.ZodOptional<zod.ZodString>;
}, zod.core.$strip>;
export type SignUp = zod.infer<typeof signUpSchema>;
export declare const postSchema: zod.ZodObject<{
    title: zod.ZodString;
    content: zod.ZodString;
}, zod.core.$strip>;
export type Post = zod.infer<typeof postSchema>;
export declare const updatePostSchema: zod.ZodObject<{
    id: zod.ZodString;
    title: zod.ZodString;
    content: zod.ZodString;
}, zod.core.$strip>;
export type UpdatePost = zod.infer<typeof updatePostSchema>;
export declare const deletePostSchema: zod.ZodObject<{
    id: zod.ZodString;
}, zod.core.$strip>;
export type DeletePost = zod.infer<typeof deletePostSchema>;
//# sourceMappingURL=index.d.ts.map