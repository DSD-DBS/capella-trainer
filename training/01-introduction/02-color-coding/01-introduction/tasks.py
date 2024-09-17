import os

from capella_trainer.tasks import TaskList, TaskDefinition, TaskContext


def check_pab_is_opened(context: TaskContext):
    res = context.client.get("/projects/exercise/diagram-editors")
    open_editors = res.json()
    # TODO more sophisticated check
    assert (
        open_editors[0]["name"] == "[PAB] Physical System"
    ), "Please chose the right model and open the '[PAB] Smart Home System'. You can find it in the model explorer."


def check_navigate_to_property_values(context: TaskContext):
    assert False, "Not implemented yet"


tasks = TaskList(
    [
        TaskDefinition(
            description='Open the pre-existing Capella model and open the "[PAB] Smart Home System" diagram in the physical architecture.',
            validator=check_pab_is_opened,
        ),
        TaskDefinition(
            description="Navigate to the Property Values view",
            validator=check_navigate_to_property_values,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
