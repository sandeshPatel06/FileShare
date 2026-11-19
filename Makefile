# ==============================================================================
# FileShare — Makefile (run `make help` to list all commands)
# NOTE for AI agents (see AGENTS.md): use `make verify` for checks.
# Do NOT run `make build` in agent loops — CI does the production build.
# ==============================================================================

SHELL := /bin/bash
.SHELLFLAGS := -eu -o pipefail -c
.DEFAULT_GOAL := help

.PHONY: help dev build start check verify lint lint-fix format typecheck clean storage pages deploy health info install ci

help: ## Show this help message
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n\nTargets:\n"} /^[a-zA-Z0-9_-]+:.*##/ {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2} END {print ""}' $(MAKEFILE_LIST)

# --- Development ---
dev: storage ## Run dev server (LAN-accessible on 0.0.0.0, HMR enabled)
	npm run dev

start: ## Serve production build (requires `make build` first)
	npm start

# --- Quality & Verification ---
verify: ## Agent-safe verification: typecheck + lint (no build, no side effects)
verify: typecheck lint

check: ## Mirror CI verification (alias to verify)
check: verify

typecheck: ## TypeScript type checking (tsc --noEmit)
	npm run typecheck

lint: ## Lint codebase with ESLint
	npm run lint

lint-fix: ## Lint and auto-fix formatting issues
	npm run lint:fix

format: lint-fix ## Alias to lint-fix

health: ## Probe local server health endpoint
	@curl -sf http://localhost:3000/api/health | jq . 2>/dev/null || curl -sf http://localhost:3000/api/health || (echo "Server is not running on http://localhost:3000" && exit 1)

# --- Build & Deploy ---
build: storage ## Production build with Turbopack (humans/CI only)
	npm run build

pages: storage ## Build Cloudflare Pages proxy bundle (dist/)
	npm run build:pages

deploy: pages ## Alias to build Cloudflare Pages proxy bundle

# --- Setup & Maintenance ---
install: ## Install dependencies (respects package-lock.json)
	npm ci --include=dev --no-audit --no-fund

ci: ## Nuclear clean install (wipes node_modules first)
	rm -rf node_modules
	npm ci --include=dev --no-audit --no-fund

storage: ## Ensure local storage dirs exist (data/ + uploads/)
	mkdir -p data uploads

clean: ## Remove build artifacts & caches (.next, out, dist, tsbuildinfo)
	npm run clean
	rm -rf dist tsconfig.tsbuildinfo

info: ## Show environment, Node, and repository status
	@echo "Node:    $$(node -v)"
	@echo "NPM:     $$(npm -v)"
	@echo "Branch:  $$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'N/A')"
	@echo "Commit:  $$(git rev-parse --short HEAD 2>/dev/null || echo 'N/A')"
