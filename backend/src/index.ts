import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign ,verify} from 'hono/jwt';

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();


app.use('/api/v1/blog/*', async (c, next) => {
 const header=c.req.header('Authorization')|| '';
 const token=header.split(' ')[1];
 const jwt=await verify(token,c.env.JWT_SECRET);
 if(jwt){
  await next();
 }
 else{
  c.status(403);
  return c.json({
    message:"incorrect token"
  })
 }
});


app.get('/', (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  return c.text('Hello joy!');
});

app.post('/api/v1/user/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const { email, password, name } = await c.req.json();

  try {
    const user = await prisma.user.create({
      data: { email, password, name },
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

app.post('/api/v1/user/signin', async(c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
const {email,password,token}=await c.req.json();
try{
  const user=await prisma.user.findFirst({
    where:{email:email,password:password}
  });
  if(!user){
    return c.json({
      message:"user not found"
    })
  }
 
  if(user?.password !== password){
    return c.json({
      message:"incorrect password"
    })
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
app.post('/api/v1/blog', (c) => c.text('create blog'));
app.put('/api/v1/blog', (c) => c.text('update blog'));
app.get('/api/v1/blog/bulk', (c) => c.text('get blogs'));
app.get('/api/v1/blog/:id', (c) => c.text(`get blog ${c.req.param('id')}`));
app.delete('/api/v1/blog/:id', (c) => c.text(`delete blog ${c.req.param('id')}`));
app.put('/api/v1/blog/:id', (c) => c.text(`update blog ${c.req.param('id')}`));

export default app;
