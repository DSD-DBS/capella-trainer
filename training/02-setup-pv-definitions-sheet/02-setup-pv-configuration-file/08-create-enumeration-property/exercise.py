import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_created_enumeration_property(context: TaskContext):
    logical_function_types = context.model.pvmt.domains.by_name(
        "Function Type"
    ).groups.by_name("Logical Function Types")


def test_linked_to_previous_type_literals(context: TaskContext):
    pass


def test_set_default_value(context: TaskContext):
    pass


def test_add_description(context: TaskContext):
    pass


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_created_enumeration_property,
        ),
        TaskDefinition(
            id=2,
            validator=test_linked_to_previous_type_literals,
        ),
        TaskDefinition(
            id=3,
            validator=test_set_default_value,
        ),
        TaskDefinition(
            id=4,
            validator=test_add_description,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
