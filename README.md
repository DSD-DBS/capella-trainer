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
- Get or create a training
  - Put the training in the `training` folder
  - You can also edit the `docker-compose.yml` file to use a different training
- Start the docker container: `docker-compose up`
- View the first lesson at `http://localhost:8000/lesson/01-introduction/01-welcome`

# Authoring Trainings

A training consists of multiple lessons, which can be nested within various folders and subfolders.

## Folder
Every folder should contain a `folder.yaml` file, which contains the display name of the folder.

```yaml
name: "How to Setup a PV Definitions sheet"
```

## Root Folder
In addition to the `folder.yaml` file, the root folder should contain a `training.yaml` file, which contains metadata about the training, such as the title and the order in which the lessons should be displayed.

```yaml
name: The name of the training goes here
description: A short description of the training goes here
author: The author of the training goes here
difficulty: 3 # 1-5
duration: 2h
```

## Lesson
Every lesson is a folder containing a `lesson.yaml` file and a `content.mdx` file (lessons do not have a `folder.yaml` file).

```yaml
# lesson.yaml
title: "The title of the lesson goes here"
```

The `content.mdx` file contains the content of the lesson. It can contain markdown and JSX, which can be used to create interactive exercises.

If you want to include images in your lesson, you can put them in the same directory as the `content.mdx` file and reference them using relative paths.

### Exercises
For interactive exercises to work, you need to add some more data to the `lesson.yaml` file.

```yaml
# ... rest of the lesson.yaml file
start_project: "Path to the Capella project that should be used as the starting point for the lesson"
exercise:
  # The texts in here can use markdown and our custom icons <CaIcon name="logicalFunction" />
  description: "A summary of the tasks that the user should complete"
  tasks:
    - id: 1
      description: A more detailed description of the task
      hint: |
        A hint to help the user complete the task
    - id: 2
      description: Another task
      hint: |
        Another hint
```

In addition to this, you need to create an `exercise.py` file. It contains the checks that will be run on the user's project to determine if the exercise was completed successfully.

```python
# This is an example exercise.py file
import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext
import capellambse.aird


def check_filter_is_set(context: TaskContext):
    diagram = context.model.diagrams[0]
    active_filters = capellambse.aird.ActiveFilters(context.model, diagram)
    assert (
        "hide.physical.links.filter" not in active_filters
    ), "Please un-check 'Hide Physical Links'"
    assert (
        "collapse.component.physical.ports.filter" not in active_filters
    ), "Please un-check 'Collapse Component Physical Ports'"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=check_filter_is_set,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
```

### Quiz
To add a quiz to a lesson, you need to add a `quiz.yaml` file to the lesson directory.

```yaml
# quiz.yaml
questions:
  - text: Some question text here
    id: 1
    question_type: single_choice
    options:
      - Option 1
      - Option 2
      - Option 3
    correct_option: 1
    explanation: Explanation text here.
  - text: Another question
    id: 2
    question_type: multiple_choice
    options:
      - Option 1
      - Option 2
      - Option 3
    correct_options:
      - 1
      - 2
    explanation: Explanation text here.
```

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
