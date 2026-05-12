.PHONY: up down restart logs build shell db-shell migrate migrate-dev migrate-reset lint

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

migrate:
	docker compose exec app npx prisma migrate deploy

migrate-dev:
	docker compose exec app npx prisma migrate dev

migrate-reset:
	docker compose exec app npx prisma migrate reset

db-push:
	docker compose exec app npx prisma db push

# ── Linting ───────────────────────────────────────────────────────────────────

lint:
	docker compose exec app npm run lint
