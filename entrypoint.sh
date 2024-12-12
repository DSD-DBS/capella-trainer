#!/bin/bash

# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0

sed -i "s|__API_BASE__|${API_BASE}|g" ./frontend/dist/env.js
sed -i "s|__ROUTE_PREFIX__|${ROUTE_PREFIX}|g" ./frontend/dist/env.js
sed -i "s|__ENABLE_BUILT_IN_CAPELLA__|${ENABLE_BUILT_IN_CAPELLA}|g" ./frontend/dist/env.js
sed -i "s|href=\"/|href=\"${ROUTE_PREFIX}/|g" ./frontend/dist/index.html
sed -i "s|src=\"/|src=\"${ROUTE_PREFIX}/|g" ./frontend/dist/index.html

uvicorn capella_trainer:app --host 0.0.0.0 --port 8000 --reload \
  --reload-dir ${TRAINING_DIR:-/app/training} --reload-include '**' \
  --reload-exclude 'project/**' --reload-exclude 'project' \
  --reload-exclude 'session.yaml'
