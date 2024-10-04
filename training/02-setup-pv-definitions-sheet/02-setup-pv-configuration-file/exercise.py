import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_created_logical_component(context: TaskContext):
    pass


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_created_logical_component,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
