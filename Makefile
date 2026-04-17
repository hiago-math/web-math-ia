# ===========================================
# mathIA Frontend (Vue.js) — Makefile
# ===========================================
.PHONY: install run build up down logs network

network:
	docker network create mathia_network 2>/dev/null || true

up: network
	docker-compose up -d

down:
	docker-compose down

build:
	npm run build

logs:
	docker-compose logs -f

install:
	npm install

run:
	npm run dev
