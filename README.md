<!--
 ~ Copyright DB InfraGO AG and contributors
 ~ SPDX-License-Identifier: Apache-2.0
 -->

# Capella Trainer

![image](https://github.com/DSD-DBS/capella-trainer/actions/workflows/lint.yml/badge.svg)

Capella Trainer is a tool for creating interactive training materials for the
Capella modeling tool. It allows you to create lessons containing text, images,
and interactive exercises (quizzes and model checks using [capellambse](https://github.com/DSD-DBS/py-capellambse).

# Quickstart using docker

- Make sure you have docker and make installed
- Clone the repository
- Get or create a training
  - Put the training in the `training` folder
  - You can also edit the `docker-compose.yml` file to use a different training
- Start the docker container: `docker-compose up`
- Open [http://localhost:8000](http://localhost:8000) in your browser

# Quickstart without docker

- Make sure you have docker, make, python 3.12 and node 22 installed
- Clone the repository
- Get or create a training
  - Put the training in the `training` folder
- Install the dependencies: `make install`
- Start the development server: `make dev`
- Open [http://localhost:5173](http://localhost:5173) in your browser

# Authoring

Check the [authoring guide](AUTHORING.md) for information on how to create your
own training materials.

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
