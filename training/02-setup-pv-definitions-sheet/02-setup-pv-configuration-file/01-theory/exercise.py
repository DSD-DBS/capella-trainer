import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def check_pv_config_opened(context: TaskContext):
    assert False, "Not implemented"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=check_pv_config_opened,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
