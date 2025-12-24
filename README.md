# 🚀 Fastify + TypeScript + Kysely Boilerplate

A clean, scalable, and production-ready **Fastify (v5) + PostgreSQL + Kysely ORM** boilerplate written in **TypeScript**, featuring modular architecture, auto-migrations, seeders, JWT authentication, file upload, cron jobs, utilities, and more.

---

## 🏆 Tech Stack

| Category | Technology |
|---------|------------|
| Runtime | **Node.js (ESM)** |
| Backend Framework | **Fastify v5** |
| ORM | **Kysely** |
| DB | **PostgreSQL** |
| Auth | **Fastify JWT** |
| Validation | **TypeBox + Ajv** |
| File Upload | **Fastify Multipart** |
| Documentation | **Fastify Swagger + Swagger UI** |
| Logging | **Pino** |
| Cron Jobs | **CRON Package** |
| Coding Standards | ESLint + Prettier |
| Git Hooks | Simple Git Hooks + Commitlint |
| Build | **tsx (no tsc emit)** |

---

## ✨ Features

- ✅ ES Module + TypeScript Support
- 📁 Clean Folder Structure
- 🗄️ Automatic Migrations & Seeders (Kysely)
- 🧬 Kysely Codegen → Strongly Typed Database
- 🔐 JWT Authentication (Login + Protected APIs)
- 📤 File Upload System (images, documents, videos, etc.)
- 📄 Pagination Helpers
- ⚠️ Error Handling with Custom API Error Class
- 📘 Auto Swagger Documentation
- ⏱️ Cron Job (Token Cleanup)
- 🧩 Modular Architecture (Controller → Service → Repository)
- 📝 Logging with Pino + Pretty
- 🔗 Auto Import Aliases (`#configs`, `#plugins`, `#repositories`, etc.)
- 🌍 Global Constants + Utility Functions
- 🚀 Fully Ready for Production Use

---

## 📂 Project Structure

```
.
├── index.ts
├── cron-job.ts
├── global-constants.ts
├── kysely.config.ts
├── tsconfig.json
├── package.json
├── .env

├── cron_job/
│   └── tokens.job.ts

├── db/
│   ├── kysely.utilities.ts
│   ├── migrations/
│   │   ├── 20250731090946_create_function_uuidv7.ts
│   │   ├── 20250731091020_create_trigger_update_timestamp.ts
│   │   ├── 20250914154107_create_table_file.ts
│   │   ├── 20250914154206_create_table_users.ts
│   │   ├── 20250914154220_create_table_todo.ts
│   └── seeds/
│       └── users.ts

├── src/
│   ├── routes.ts
│
│   ├── configs/
│   │   ├── bcrypt.config.ts
│   │   ├── environment.config.ts
│   │   ├── file-routes.config.ts
│   │   ├── jwt.config.ts
│   │   ├── kysely-kv.config.ts
│   │   ├── kysely.config.ts
│   │   ├── logger.config.ts
│   │   ├── multipart.config.ts
│   │   ├── static-serve.config.ts
│   │   └── swagger.config.ts
│
│   ├── plugins/
│   │   ├── bcrypt.plugin.ts
│   │   ├── jwt.plugin.ts
│   │   ├── kysely-kv.plugin.ts
│   │   ├── kysely.plugin.ts
│   │   └── logger.plugin.ts
│
│   ├── repositories/
│   │   ├── auth.repository.ts
│   │   ├── file.repository.ts
│   │   ├── query-helpers.ts
│   │   ├── todo.repository.ts
│   │   ├── token.repository.ts
│   │   └── user.repository.ts
│
│   ├── schemas/
│   │   ├── common.schema.ts
│   │   └── user.schema.ts
│
│   ├── types/
│   │   └── database.ts
│
│   ├── utilities/
│   │   ├── case-converter.ts
│   │   ├── constants.ts
│   │   ├── custom-error.ts
│   │   ├── date-helpers.ts
│   │   ├── get-conflicts.ts
│   │   ├── hash.ts
│   │   ├── http-status-codes.ts
│   │   ├── key-generator.ts
│   │   ├── key-helpers.ts
│   │   ├── logger.ts
│   │   ├── otp.ts
│   │   ├── pagination-helpers.ts
│   │   ├── password-generator.ts
│   │   ├── postgres_error_codes.ts
│   │   ├── promise-handler.ts
│   │   ├── random-uuid-v7.ts
│   │   ├── time-constants.ts
│   │   └── uploadFile.ts
│
│   └── web/
│       ├── web.routes.ts
│
│       ├── auth/
│       │   ├── auth.controller.ts
│       │   ├── auth.routes.ts
│       │   ├── auth.service.ts
│       │   └── auth.swagger.ts
│
│       └── user/
│           ├── user.controller.ts
│           ├── user.routes.ts
│           ├── user.service.ts
│           └── user.swagger.ts

└── uploads/
    ├── images/
    ├── documents/
    ├── videos/
    ├── audios/
    ├── spreadsheets/
    ├── presentations/
    ├── texts/
    └── others/
```

---

## ⚙️ Environment Setup

```
PROTOCOL = http
PORT=5000
HOST = "0.0.0.0"
DOMAIN = "<yout-domain>"
BASEPATH = "<your-basepath>"
DB_HOST = "<your-db-host>"
DB_PORT = your_db_port
DB_USER = "<your-db-user>"
DB_PASSWORD = "<your-db-password>"
DATABASE = "<your-database-name>"
ACCESS_JWT_SECRET = JWT-secret
ACCESS_JWT_EXPIRES_IN = 24h
REFRESH_JWT_SECRET = JWT-refresh-secret
REFRESH_JWT_EXPIRES_IN = 48h
NODE_ENV=development
```

---

## ▶️ Running the Project

### Install Dependencies
```bash
npm install
npm run start:dev
npm start
```

### 🗄️ Database (Kysely ORM)
```bash
npm run migrate:latest
npm run migrate:rollback
npm run migrate:make
npm run seed:run
npm run kysely-codegen
```

### 📚 API Documentation (Swagger)
http://localhost:5000/docs

---

## 🔐 Authentication Flow

Client → /auth/login
Server → Validate User → Return JWT Token
Client → Calls Protected Routes with Bearer Token

---

## 🧩 Import Alias Support

```ts
import { bcryptConfig } from '#configs/bcrypt.config';
import { jwtPlugin } from '#plugins/jwt.plugin';
import { UserRepository } from '#repositories/user.repository';
import { CustomError } from '#utilities/custom-error';
```

---

## 📝 Commitlint Configuration (For Git Commits)

The repository uses **commitlint** to enforce conventional commit messages.

`.commitlintrc.json` file:

### ✔️ How to Use These Commit Types

Example commit messages:

- `feat: user login API added`
- `fix: pagination crash issue resolved`
- `docs: updated README with commitlint rules`
- `review: PR feedback changes added`
- `chore: dependencies updated`

---

## 📜 License

Licensed under the ISC License.
Developed by **Syed Taqiuddin**.

---

🎉 Ready for Production — Build Anything:

- SaaS Backends
- Admin Panels
- Mobile App APIs
- Microservices
- Authentication Systems

