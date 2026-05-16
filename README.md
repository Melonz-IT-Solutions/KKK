# KKK (Kapuso, Kapamilya, Kapatid)

## Project Setup

Clone the repo

```bash
git clone git@github.com:Melonz-IT-Solutions/KKK.git
```

or via HTTPS

```bash
git clone https://github.com/Melonz-IT-Solutions/KKK.git
```

```bash
cd KKK
```

Once cloned, build the app using this command (make sure docker is running)

```bash
make build
```

It will automatically copy the .env.example file and its contents and create a new .env file

If .env doesn't exists we can create it manually (bash user)

```bash
cp .env.example .env
```

For non-bash users just simply create .env file in the root folder and
ask for DATABASE_URL on other devs

If you want to use local DB set this on your .env file

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/kkk_db"
```

By default the app will run in port 3000.

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Project Structure (Initial)

```text
KKK/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── dashboard/          # Protected pages
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/             # Reusable UI components
│   ├── ui/
│   ├── forms/
│   └── layouts/
│
├── lib/                    # Shared utilities
│   ├── prisma.ts
│   ├── auth.ts
│   ├── validations/
│   └── helpers/
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── public/                 # Static assets
│
├── services/               # Business logic / API services
│
├── hooks/                  # Custom React hooks
│
├── types/                  # Global TypeScript types
│
├── proxy.ts (middleware)   # https://nextjs.org/docs/messages/middleware-to-proxy
├── next.config.js
├── tsconfig.json
├── package.json
├── Dockerfile
├── docker-compose.yml
├── Makefile
├── .env
└── README.md
```
