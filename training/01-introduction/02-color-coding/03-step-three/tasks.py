import os

from capella_trainer.tasks import TaskList, TaskDefinition, TaskContext


def check_pab_is_opened(context: TaskContext):
    res = context.client.get("/projects")
    open_projects = res.json()
    # TODO correct check
    assert (
        len(open_projects) > 0
    ), 'Please un-check the required fields. You find it in the "Filter" on the top of your Diagram.'


tasks = TaskList(
    [
        TaskDefinition(
            description='Un-check "Collapse Component Physical Ports" and "Hide Physical Links" in the filter menu',
            validator=check_pab_is_opened,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
