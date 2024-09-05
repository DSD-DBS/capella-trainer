from capella_trainer.tasks import TaskList, TaskDefinition, TaskContext


def check_pab_is_opened(context: TaskContext):
    res = context.client.get("/projects")
    open_projects = res.json()
    # TODO more sophisticated check
    assert (
        len(open_projects) > 0
    ), "Please chose the right start-project and open the '[PAB] Smart Home System'. You find it in the start-project explorer."


tasks = TaskList(
    [
        TaskDefinition(
            description="Open the physical architecture overview [PAB] Smart Home System",
            validator=check_pab_is_opened,
        ),
    ]
)
