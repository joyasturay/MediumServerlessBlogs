# Medium Clone Backend

This project is a backend for a Medium-like blogging platform, built using Hono, Prisma, and Cloudflare Workers. It provides APIs for user authentication, blog post creation, and other core functionalities.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)

## Features

- User authentication (signup, signin)
- JWT-based authorization
- Blog post creation, reading, updating, and deletion
- Integration with Prisma Accelerate for database access on Cloudflare Workers

## Technologies Used

- **Hono**: A small, simple, and ultrafast web framework for the Edge.
- **Prisma**: Next-generation ORM for Node.js and TypeScript.
- **Prisma Accelerate**: Global database access for Prisma, optimized for serverless and edge environments.
- **Cloudflare Workers**: Serverless platform for running JavaScript, WebAssembly, and more on Cloudflare's global network.
- **TypeScript**: Superset of JavaScript that adds static types.
- **PostgreSQL**: Relational database (via Neon.tech).

- `backend/`: Contains the Cloudflare Worker backend application.
  - `src/index.ts`: Main entry point for the Hono application.
  - `src/routes/`: (Planned) Directory for organizing API routes.
  - `prisma/`: Contains Prisma schema and migrations.
- `Common/`: A shared module, for common types or utilities(zod validations).
