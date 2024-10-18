import os

import capellambse.metamodel.la

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_created_logical_component(context: TaskContext):
    logical_function_types = context.model.pvmt.domains.by_name(
        "Function Type"
    ).groups.by_name("Logical Function Types")

    assert len(logical_function_types.selector.classes) > 0, "Create a new EClass Rule"
    assert (
        len(logical_function_types.selector.classes) < 2
    ), "Create only one EClass Rule"
    assert any(
        eclass_rule == capellambse.metamodel.la.LogicalFunction
        for eclass_rule in logical_function_types.selector.classes
    ), "The type of the EClass Rule should be LogicalFunction"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_created_logical_component,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
