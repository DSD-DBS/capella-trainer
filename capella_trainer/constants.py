# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0

import os

TRAINING_DIR = os.path.abspath(os.environ.get("TRAINING_DIR", "./training"))
CAPELLA_ENDPOINT = os.environ.get(
    "CAPELLA_ENDPOINT", "http://localhost:5007/api/v1"
)
ROUTE_PREFIX = os.getenv("ROUTE_PREFIX", "")
