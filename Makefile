# ===========================================
# mathIA Frontend (Vue.js) — Makefile
# ===========================================
.PHONY: install run build up dev down down-all logs network traefik

network:
	@docker network create mathia_network 2>/dev/null || true
	@docker network create fintools 2>/dev/null || true

traefik: network
	@if [ "$$(docker ps -q -f name=^traefik$$)" = "" ]; then \
		echo "==> Traefik não está rodando, subindo..."; \
		docker compose -f ../api-math/docker/local/docker-compose.traefik.yml up -d; \
	else \
		echo "==> Traefik já está rodando, pulando."; \
	fi

up: traefik
	@cp -f k8s/envs/env.local src/.env
	@docker compose up -d --build
	@echo ""
	@echo "=========================================="
	@echo "  Frontend rodando!"
	@echo "=========================================="
	@echo "  Acesso:   http://mathia.localhost"
	@echo "  Traefik:  http://localhost:8080"
	@echo "=========================================="
	@echo ""

dev: traefik
	@cp -f k8s/envs/env.local src/.env
	@docker compose up --build
	@echo ""
	@echo "=========================================="
	@echo "  Frontend DEV com hot-reload!"
	@echo "=========================================="
	@echo "  Acesso:   http://mathia.localhost"
	@echo "  Traefik:  http://localhost:8080"
	@echo "=========================================="
	@echo ""

down:
	docker compose down

down-all:
	docker compose down
	docker compose -f docker/local/docker-compose.traefik.yml down

build:
	docker compose build

logs:
	docker compose logs -f

install:
	cd src && npm install

run:
	cd src && npm run dev
