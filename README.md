# Medium Clone Backend

This project is a backend for a Medium-like blogging platform, built using Hono, Prisma, and Cloudflare Workers. It provides APIs for user authentication, blog post creation, and other core functionalities.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup and Installation](#setup-and-installation)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
- [Deployment](#deployment)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

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
  - `wrangler.jsonc`: Cloudflare Wrangler configuration for deploying the Worker.
- `Common/`: A shared module, likely for common types or utilities.

## Setup and Installation

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- Cloudflare Wrangler CLI (`npm i -g wrangler`)
- A Neon.tech account for PostgreSQL database
- A Prisma Accelerate API key

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/joyasturay/MediumServerlessBlogs.git
    cd medium
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    cd backend
    npm install
    cd ../Common
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the `backend/` directory. See the [Environment Variables](#environment-variables) section for details.

4.  **Run Prisma Migrations:**
    ```bash
    cd backend
    npx prisma migrate dev --name init
    ```

5.  **Start the development server:**
    ```bash
    cd backend
    npm run dev
    ```
    This will start the Cloudflare Worker locally, typically on `http://localhost:8787`.

### Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```dotenv
# For local Prisma CLI operations and local development
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRISMA_ACCELERATE_API_KEY"

# Your JWT secret for token signing
JWT_SECRET="YOUR_JWT_SECRET"
```

**Important:** The `DATABASE_URL` in `.env` should be your Prisma Accelerate connection string to ensure local Prisma commands (like `migrate`) use the correct protocol. For deployment to Cloudflare Workers, the `DATABASE_URL` is also configured in `wrangler.jsonc`.

### Database Setup

This project uses PostgreSQL via Neon.tech and Prisma Accelerate.

1.  **Create a PostgreSQL database on Neon.tech.**
2.  **Obtain your Prisma Accelerate API key.**
3.  **Update `backend/wrangler.jsonc`:**
    Ensure your `DATABASE_URL` in the `vars` section of `wrangler.jsonc` is set to your Prisma Accelerate connection string.

    ```jsonc:%2FUsers%2Fjoyasturay%2FDesktop%2F100xdev%2Fmedium2%2Fbackend%2Fwrangler.jsonc
    // ... existing code ...
    "vars": {
        "DATABASE_URL": "prisma+postgres://accelerate.prisma-data.net/?api_key=YOUR_PRISMA_ACCELERATE_API_KEY",
        "JWT_SECRET": "YOUR_JWT_SECRET"
    },
    // ... existing code ...
    ```

4.  **Run Prisma migrations** (as shown in [Local Development](#local-development)).

## Deployment

To deploy your Cloudflare Worker:

```bash
cd backend
npx wrangler deploy
```

Ensure your `wrangler.jsonc` has the correct `account_id` and `route` configurations.

## API Endpoints

All API endpoints are prefixed with `/api/v1`.

### User Authentication

-   `POST /api/v1/user/signup`
    -   Creates a new user.
    -   **Request Body:** `{ email, password, name? }`
    -   **Response:** `{ jwt: string }` on success, `{ message: string }` on error.

-   `POST /api/v1/user/signin`
    -   Authenticates an existing user.
    -   **Request Body:** `{ email, password }`
    -   **Response:** `{ jwt: string }` on success, `{ message: string }` on error.

### Blog Posts

-   `POST /api/v1/blog`
    -   Create a new blog post.
    -   **Request Body:** `{ title, content }`
    -   **Authentication:** Requires JWT token.

-   `PUT /api/v1/blog`
    -   Update an existing blog post.
    -   **Request Body:** `{ id, title?, content? }`
    -   **Authentication:** Requires JWT token.

-   `GET /api/v1/blog/bulk`
    -   Retrieve multiple blog posts (e.g., for a feed).

-   `GET /api/v1/blog/:id`
    -   Retrieve a single blog post by ID.

-   `DELETE /api/v1/blog/:id`
    -   Delete a blog post by ID.
    -   **Authentication:** Requires JWT token.

## Contributing

Contributions are welcome! Please follow standard GitHub flow:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'feat: Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.
