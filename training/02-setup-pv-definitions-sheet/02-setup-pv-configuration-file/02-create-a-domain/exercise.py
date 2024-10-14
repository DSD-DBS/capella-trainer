import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_create_new_domain(context: TaskContext):
    domains = context.model.pvmt.domains
    assert len(domains) > 3, "Create a new domain called 'Function Type'"
    try:
        function_type = domains.by_name("Function Type")
    except KeyError:
        function_type = None
    assert function_type is not None, "Make sure to call it 'Function Type'"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_create_new_domain,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
