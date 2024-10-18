import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_created_new_extension(context: TaskContext):
    try:
        function_type = context.model.pvmt.domains.by_name("Function Type")
    except:
        function_type = None
    assert (
        function_type is not None
    ), "Domain 'Function Type' not found, did you create it in the previous task?"
    try:
        extension = function_type.groups.by_name("Logical Function Types")
    except KeyError:
        extension = None
    assert (
        extension is not None
    ), "Create a new extension called 'Logical Function Types'"

    assert (
        extension.selector.raw == "[ARCHITECTURE]LOGICAL[/ARCHITECTURE]"
    ), "Set the extension scope to the Logical layer"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_created_new_extension,
        )
    ],
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
