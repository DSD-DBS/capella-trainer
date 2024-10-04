import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def check_pab_is_opened(context: TaskContext):
    res = context.client.get("/projects/exercise/diagram-editors")
    open_editors = res.json()
    # TODO more sophisticated check
    assert (
        open_editors[0]["name"] == "[PAB] Physical System"
    ), "Please chose the right model and open the '[PAB] Smart Home System'. You can find it in the model explorer."


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