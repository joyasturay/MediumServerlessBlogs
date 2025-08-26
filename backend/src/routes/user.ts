import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import {signUpSchema } from '@joyastu/common';
import { signInSchema } from '@joyastu/common';
export const userRouter= new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
  }>();
  userRouter.post('/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { email, password, name } = await c.req.json();
 const parsed=signUpSchema.safeParse({email,password,name});
  if(!parsed.success){
    return c.json({
      message:"incorrect inputs",
    })
  }
  const {email:parsedEmail,password:parsedPassword,name:parsedName}=parsed.data;
  try {
     const saltRounds = 10; 
  const passwordHash = await bcrypt.hash(parsedPassword, saltRounds);
    const user = await prisma.user.create({
      data: { email:parsedEmail, password:passwordHash, name:parsedName },
    });

    const token = await sign({ id: user.id }, c.env.JWT_SECRET);

    return c.json({
      message: 'User created',
      user,
      token,
    });
  } catch (e) {
    c.status(403);
    return c.json({
      error: 'error while signing up',
      message: (e as Error).message,
    });
  }
});

userRouter.post('/signin', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
const {email,password,token}=await c.req.json();
const parsed=signInSchema.safeParse({email,password});
if(!parsed.success){
  return c.json({
    message:"incorrect inputs",
  })
}
const {email:parsedEmail,password:parsedPassword}=parsed.data;
try{
  const user=await prisma.user.findFirst({
    where:{email:parsedEmail}
  });
  if(!user){
    return c.json({
      message:"user not found"
    })
  }
  const passwordMatch = await bcrypt.compare(parsedPassword, user.password);
  if (!passwordMatch) {
    return c.json({
      message: 'Incorrect password',
    });
  }

  const jwt=await sign({id:user.id},c.env.JWT_SECRET);
  if(jwt){
    return c.json({
      message:"user signed in",
      jwt
    });
  }
  else{
    return c.json({
      message:"incorrect token"
    })
  }
}
catch(e){
  return c.json({
    message:"error while signing in",
    error:(e as Error).message
  })
}
});
