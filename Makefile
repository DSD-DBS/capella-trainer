# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0

VENV = venv

install-frontend:
	cd frontend && pnpm install

dev-frontend:
	cd frontend && VITE_ROUTE_PREFIX=/ VITE_API_BASE=http://localhost:8001 VITE_ENABLE_BUILT_IN_CAPELLA=true pnpm run dev

install-backend:
	if [ ! -d "$(VENV)" ]; \
		then printf "\033[0;31mThe directory $$(readlink -f $(VENV)) doesn't exist. A venv will be created now.\n\033[0m" && \
		python -m venv $(VENV); \
	fi;
	$(VENV)/bin/pip install -e ".[dev]"

dev-backend:
	if [ -d "$(VENV)/bin" ]; then \
		source $(VENV)/bin/activate; \
	else \
		source $(VENV)/Scripts/activate; \
	fi && \
	CONTAINER_TRAINING_DIR=/app/training uvicorn capella_trainer:app --reload --port 8001 --log-level debug

download-capella-dropins:
	mkdir -p dropins
	cd dropins && curl -L -O https://github.com/DSD-DBS/capella-addons/releases/download/rest-api%2Fv0.1.10/com.deutschebahn.rest-api_0.1.10_linux_x64_capella_6.0.0.jar

dev-capella:
	docker run \
		--name capella-trainer-capella \
		--rm \
		-p 5007:5007 \
		-p 8088:10000 \
		-e CONNECTION_METHOD=xpra \
		-e XPRA_SUBPATH="/" \
		-e XPRA_CSP_ORIGIN_HOST="http://localhost:5173" \
		-v ./training:/app/training \
		-v ./workspace:/workspace \
		-v ./dropins:/opt/capella/dropins \
		ghcr.io/dsd-dbs/capella-dockerimages/capella/remote:6.0.0-selected-dropins-main

install: install-frontend install-backend download-capella-dropins

dev:
	make -j3 dev-frontend dev-backend dev-capella
