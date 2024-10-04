import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_created_logical_component(context: TaskContext):
    pass


def test_name_event_detection_system(context: TaskContext):
    pass


def test_allocate_logical_function(context: TaskContext):
    pass


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_created_logical_component,
        ),
        TaskDefinition(
            id=2,
            validator=test_name_event_detection_system,
        ),
        TaskDefinition(
            id=3,
            validator=test_allocate_logical_function,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
