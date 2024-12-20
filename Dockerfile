# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0

# Build frontend
FROM node:22 as build-frontend
RUN corepack enable
WORKDIR /app
COPY frontend/package*.json ./
RUN pnpm install
COPY frontend/ ./
RUN pnpm run build

# Build backend
FROM python:3.12
WORKDIR /app

USER root

COPY ./capella_trainer ./capella_trainer
COPY ./pyproject.toml ./
COPY ./.git ./.git

RUN pip install . --no-cache-dir
COPY --from=build-frontend /app/dist/ ./frontend/dist/

# Expose the port the app runs in
EXPOSE 8000

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && chmod -R 777 ./frontend/

# Run as non-root user per defaults
USER 1000

ENTRYPOINT ["/entrypoint.sh"]
