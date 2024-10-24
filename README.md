<!--
 ~ Copyright DB InfraGO AG and contributors
 ~ SPDX-License-Identifier: Apache-2.0
 -->

# capella_trainer

![image](https://github.com/DSD-DBS/capella-trainer/actions/workflows/build-test-publish.yml/badge.svg)
![image](https://github.com/DSD-DBS/capella-trainer/actions/workflows/lint.yml/badge.svg)

Short one-line project description

# Documentation

Read the [full documentation on Github pages](https://dsd-dbs.github.io/capella-trainer).

# Quickstart using docker
- Clone the repository
- Log into the docker registry using a personal access token: `docker login ghcr.io`
- Start the docker container: `docker-compose up -f docker-compose.prod.yml`
- View the first lesson at `http://localhost:8000/lesson/01-introduction/01-welcome`

# Installation

You can install the latest released version directly from PyPI.

```sh
pip install capella-trainer
```

To set up a development environment, clone the project and install it into a
virtual environment.

```sh
git clone https://github.com/DSD-DBS/capella-trainer
cd capella-trainer
python -m venv .venv

source .venv/bin/activate.sh  # for Linux / Mac
.venv\Scripts\activate  # for Windows

pip install -U pip pre-commit
pip install -e '.[docs,test]'
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
