import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign ,verify} from 'hono/jwt';
import { blogRouter } from './routes/blog';
import { userRouter } from './routes/user';
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();



app.route("/api/v1/blog",blogRouter);
app.route("/api/v1/user",userRouter);




app.get('/', (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  return c.text('Hello joy!');
});


export default app;
