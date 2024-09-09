import os

from capella_trainer.tasks import TaskList, TaskDefinition, TaskContext


def check_pab_is_opened(context: TaskContext):
    res = context.client.get("/projects")
    open_projects = res.json()
    # TODO more sophisticated check
    assert (
        len(open_projects) > 0
    ), "Please chose the right model and open the '[PAB] Smart Home System'. You can find it in the model explorer."


tasks = TaskList(
    [
        TaskDefinition(
            description='Open the pre-existing Capella model and open the "[PAB] Smart Home System" diagram in the physical architecture.',
            validator=check_pab_is_opened,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
