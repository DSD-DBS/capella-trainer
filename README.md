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

- Clone the repository
- Get or create a training
  - Put the training in the `training` folder
  - You can also edit the `docker-compose.yml` file to use a different training
- Start the docker container: `docker-compose up`
- View the first lesson at `http://localhost:8000/lesson/01-introduction/01-welcome`

# Authoring

Check the [authoring guide](AUTHORING.md) for information on how to create your
own training materials.

# Installation

To set up a development environment, clone the project and install it into a
virtual environment.

```sh
git clone https://github.com/DSD-DBS/capella-trainer
cd capella-trainer
python -m venv .venv

source .venv/bin/activate.sh  # for Linux / Mac
.venv\Scripts\activate  # for Windows

pip install -U pip pre-commit
pip install -e '.[dev,test]'
pre-commit install
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
