<!--
 ~ Copyright DB InfraGO AG and contributors
 ~ SPDX-License-Identifier: Apache-2.0
 -->

# Capella Trainer

![image](https://github.com/DSD-DBS/capella-trainer/actions/workflows/lint.yml/badge.svg)

Capella Trainer is a tool for creating interactive training materials for the
Capella modeling tool. It allows you to create lessons containing text, images,
and interactive exercises (model checks using [capellambse](https://github.com/DSD-DBS/py-capellambse) and quizzes).

# Quickstart using docker-compose

- Make sure you have docker and make installed
- Clone the repository
- Get or create a training
  - Put the training in the `training` folder
  - You can also edit the `docker-compose.yml` file to use a different training
- Download the Capella Dropin using `make download-capella-dropins`
- Start the docker container: `docker-compose up`
- Open [http://localhost:8000](http://localhost:8000) in your browser

# Quickstart without docker-compose

- Make sure you have docker, make, python 3.12 and node 22 installed
- Enable corepack using `corepack enable`
- Clone the repository
- Get or create a training
  - Put the training in the `training` folder
- Install the dependencies: `make install`
- Start the development server: `make dev`
- Open [http://localhost:5173](http://localhost:5173) in your browser

# Authoring

Check the [authoring guide](AUTHORING.md) for information on how to create your
own training materials.

## Integration in the Capella Collaboration Manager

The Capella Trainer can be integrated into the [Capella Collaboration Manager](https://github.com/DSD-DBS/capella-collab-manager).

To do so, you have to be administrator in a running instance of the Capella Collaboration Manager.
Navigate to `Menu` > `Settings` > `Tools` > `Add a new tool` and fill in the following configuration:

```yml
name: Training Controller
config:
  resources:
    cpu:
      requests: 0.4
      limits: 2
    memory:
      requests: 0.6Gi
      limits: 6Gi
  environment: {}
  connection:
    methods:
      - id: http
        type: http
        name: Browser Connection
        ports:
          metrics: 8000
          http: 8000
        environment:
          API_BASE: "{CAPELLACOLLAB_SESSIONS_BASE_PATH}"
          ROUTE_PREFIX: "{CAPELLACOLLAB_SESSIONS_BASE_PATH}"
          TRAINING_DIR:
            stage: before
            value: "{CAPELLACOLLAB_SESSION_PROVISIONING[0][path]}"
          HOST_FRONTEND: "TRUE"
        sharing:
          enabled: false
        redirect_url: "{CAPELLACOLLAB_SESSIONS_SCHEME}://{CAPELLACOLLAB_SESSIONS_HOST}:{CAPELLACOLLAB_SESSIONS_PORT}{CAPELLACOLLAB_SESSIONS_BASE_PATH}/"
        cookies: {}
  monitoring:
    prometheus:
      path: /metrics
  provisioning:
    directory: /models
    max_number_of_models: 1
    required: true
  persistent_workspaces:
    mounting_enabled: true
  supported_project_types:
    - training
```

After saving the configuration, you have to add a version for the new tool:

```yml
name: "Latest"
config:
  is_recommended: true
  is_deprecated: false
  sessions:
    persistent:
      image:
        regular: ghcr.io/dsd-dbs/capella-trainer/capella-trainer:main
        beta: null
  backups:
    image: null
  compatible_versions: []
```

In addition, you have to expose the REST API port of the Capella tool in the tool configuration of the Capella tool:

```yml
config:
  [...]
  connection:
    methods:
      - [...]
        ports:
          additional:
            restapi: 5007
```

# Contributing

We'd love to see your bug reports and improvement suggestions! Please take a
look at our [guidelines for contributors](CONTRIBUTING.md) for details.

# Licenses

This project is compliant with the
[REUSE Specification Version 3.0](https://git.fsfe.org/reuse/docs/src/commit/d173a27231a36e1a2a3af07421f5e557ae0fec46/spec.md).

Copyright DB InfraGO AG, licensed under Apache 2.0 (see full text in
[LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt))

Dot-files are licensed under CC0-1.0 (see full text in
[LICENSES/CC0-1.0.txt](LICENSES/CC0-1.0.txt))
