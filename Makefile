.PHONY: up down restart logs build shell db-shell migrate migrate-dev migrate-reset lint lint-fix

# ── Docker ────────────────────────────────────────────────────────────────────

up:
	docker compose up

build:
	docker compose up --build

down:
	docker compose down

restart:
	docker compose restart app

logs:
	docker compose logs -f app

# ── Shells ────────────────────────────────────────────────────────────────────

shell:
	docker compose exec app sh

db-shell:
	docker compose exec db psql -U postgres -d kkk_db

# ── Prisma ────────────────────────────────────────────────────────────────────
prisma-gui:
	docker compose exec -T app sh -c "sed -i 's/var cO=\"127\.0\.0\.1\"/var cO=\"0.0.0.0\"/' node_modules/prisma/build/cli.js && npx prisma studio --port 51212 --browser none"

migrate:
	docker compose exec -T app npx prisma migrate deploy

migrate-dev:
	docker compose exec -T app npx prisma migrate dev

migrate-reset:
	docker compose exec -T app npx prisma migrate reset

db-push:
	docker compose exec -T app npx prisma db push

prisma-generate:
	docker compose exec -T app npx prisma generate

db-seed:
	docker compose exec -T app npx prisma db seed

# ── Node ───────────────────────────────────────────────────────────────────────
npm-install:
	docker compose exec -T app npm install

# ── Linting ───────────────────────────────────────────────────────────────────

lint:
	docker compose exec -T app npm run lint

lint-fix:
	docker compose exec -T app npm run lint -- --fix
