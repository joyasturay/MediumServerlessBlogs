import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign ,verify} from 'hono/jwt';
import { postSchema } from '@joyastu/common';
import { updatePostSchema } from '@joyastu/common';
 export const blogRouter= new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
     Variables: {
    jwtPayload: { userId: string };
  };
  }>();
  blogRouter.use('/*', async (c, next) => {
 const header=c.req.header('Authorization')|| '';
 const token=header.split(' ')[1];
 const jwt=await verify(token,c.env.JWT_SECRET);
 if(jwt){
    c.set('jwtPayload', { userId: jwt.id });
  await next();
 }
 else{
  c.status(403);
  return c.json({
    message:"incorrect token"
  })
 }
});
  blogRouter.post('/', async(c) => {
    const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try{
  const {title,content}=await c.req.json();
  const parsed=postSchema.safeParse({title,content});
  if(!parsed.success){
    return c.json({
      message:"incorrect inputs",
    })
  }
  const {title:parsedTitle,content:parsedContent}=parsed.data;
  const authorId = c.get('jwtPayload').userId;
  const blog=await prisma.post.create({
    data:{
      title:parsedTitle,
      content:parsedContent,
      authorId
    }
  });
  return c.json({
    message:"blog created",
    blog
  })
}catch(e){
    return c.json({
        message:"invalid inputs"
    })
}

  });
  blogRouter.put('/', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    const {title,content,id}=await c.req.json();
    const parsed=updatePostSchema.safeParse({title,content,id});
   if(!parsed.success){
      return c.json({
        message:"incorrect zod inputs", 
      })
    }
      const {title:parsedTitle,content:parsedContent,id:parsedId}=parsed.data;
    const authorId = c.get('jwtPayload').userId;
    try{
    const blog=await prisma.post.update({
      where:{
        id:parsedId
      },
      data:{
        title:parsedTitle,
        content:parsedContent,
        authorId
      }
    });
    return c.json({
      message:"blog updated",
      blog
    })
  }catch(e){
    return c.json({
      message:"invalid inputs"
    })
  }
  });
  blogRouter.get('/bulk', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
      const blogs=await prisma.post.findMany({
        include:{
          author:true
        }
      });
      return c.json({
        blogs
      })
    }catch(e){
      return c.json({
        message:"invalid inputs"
      })
    }
  });
  blogRouter.get('/:id', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
      const blog=await prisma.post.findFirst({
        where:{
          id:c.req.param('id')
        },
        include:{
          author:true
        }
      });
      return c.json({
        blog
      })
    }catch(e){
      return c.json({
        message:"invalid inputs"
      })
    }
  });
  blogRouter.delete('/:id', async(c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    try{
      const blog=await prisma.post.delete({
        where:{
          id:c.req.param('id')
        }
      });
      return c.json({
        message:"blog deleted",
        blog
      })
    }catch(e){
      return c.json({
        message:"invalid inputs"
      })
    }
  });
