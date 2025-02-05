# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0

import logging
import os

import httpx


def get_capella_endpoint() -> str | None:
    logging.debug("Getting Capella endpoint")
    backend_url = os.getenv("CAPELLACOLLAB_API_BASE_URL")
    user_id = os.getenv("CAPELLACOLLAB_SESSION_REQUESTER_USER_ID")
    username = os.getenv("CAPELLACOLLAB_SESSION_REQUESTER_USERNAME")
    session_id = os.getenv("CAPELLACOLLAB_SESSION_ID")
    personal_access_token = os.getenv("CAPELLACOLLAB_SESSION_API_TOKEN")

    if (
        backend_url is None
        or user_id is None
        or username is None
        or session_id is None
        or personal_access_token is None
    ):
        logging.warning(
            "Missing environment variables for getting Capella endpoint from CCM"
        )
        return None

    auth = httpx.BasicAuth(username=username, password=personal_access_token)
    client = httpx.Client(base_url=backend_url, auth=auth)

    try:
        resp = client.get(f"/v1/users/{user_id}/sessions")
        sessions = resp.json()

    except httpx.HTTPError as e:
        logging.warning("Failed to get sessions", exc_info=e)
        return None

    project_id = next(
        (s["project"]["id"] for s in sessions if s["id"] == session_id), None
    )
    if project_id is None:
        logging.warning("Failed to find own project_id")
        return None

    capella_session = next(
        (
            s
            for s in sessions
            if s["project"]["id"] == project_id
            and s["version"]["tool"]["name"] == "Capella"
        ),
        None,
    )
    if capella_session is None:
        logging.warning("Failed to find Capella session for own project")
        return None

    return f"http://{capella_session['internal_endpoint']}:5007/api/v1"


TRAINING_DIR = os.path.abspath(os.environ.get("TRAINING_DIR", "./training"))
# This is only relevant when doing local development, as the training directory does not have the same path in the container as on the host
CONTAINER_TRAINING_DIR = os.getenv("CONTAINER_TRAINING_DIR", TRAINING_DIR)
CAPELLA_ENDPOINT = os.getenv(
    "CAPELLA_ENDPOINT",
    get_capella_endpoint() or "http://localhost:5007/api/v1",
)
ROUTE_PREFIX = os.getenv("ROUTE_PREFIX", "")
_HOST_FRONTEND = os.getenv("HOST_FRONTEND", "FALSE")
HOST_FRONTEND = _HOST_FRONTEND.lower() in ["true", "1", "yes"]

logging.debug("TRAINING_DIR: %s", TRAINING_DIR)
logging.debug("CAPELLA_ENDPOINT: %s", CAPELLA_ENDPOINT)
logging.debug("ROUTE_PREFIX: %s", ROUTE_PREFIX)
logging.debug("HOST_FRONTEND: %s", HOST_FRONTEND)
