import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def check_pab_is_opened(context: TaskContext):
    res = context.client.get("/projects/exercise/diagram-editors")
    open_editors = res.json()
    # TODO more sophisticated check
    assert any(
        open_editor["name"] == "[PAB] Physical System" for open_editor in open_editors
    ), "Please chose the right model and open the '[PAB] Smart Home System'. You can find it in the model explorer."


def check_navigate_to_property_values(context: TaskContext):
    assert False, "Not implemented yet"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=check_pab_is_opened,
        ),
        TaskDefinition(
            id=2,
            validator=check_navigate_to_property_values,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
