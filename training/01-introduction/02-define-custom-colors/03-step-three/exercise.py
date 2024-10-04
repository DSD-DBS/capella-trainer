import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext
import capellambse.aird


def check_pab_is_opened(context: TaskContext):
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
            validator=check_pab_is_opened,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
