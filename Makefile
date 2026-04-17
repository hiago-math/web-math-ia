# ===========================================
# mathIA Frontend (Vue.js) — Makefile
# ===========================================
.PHONY: install run build up down logs network shell

network:
	@docker network create fintools 2>/dev/null || true

up: network
	@docker-compose up -d --build
	@echo ""
	@echo "=========================================="
	@echo "  Frontend rodando!"
	@echo "=========================================="
	@echo "  Acesso:          http://mathia-web.localhost"
	@echo "  API Laravel:     http://mathia-api.localhost"
	@echo "=========================================="
	@echo ""

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

shell:
	docker-compose exec app sh
