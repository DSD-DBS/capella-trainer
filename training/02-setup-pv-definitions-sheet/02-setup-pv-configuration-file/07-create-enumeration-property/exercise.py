import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_created_enumeration_property(context: TaskContext):
    logical_function_types = context.model.pvmt.domains.by_name(
        "Function Type"
    ).groups.by_name("Logical Function Types")
    assert logical_function_types is not None, "Logical Function Types not found"
    assert (
        len(logical_function_types.property_values) > 0
    ), "Create a new Enumeration Property named 'Function Types' in the 'Logical Function Types' group"

    function_types = logical_function_types.property_values.by_name("Function Types")
    assert (
        function_types is not None
    ), "Make sure the Enumeration Property is named 'Function Types'"

    print(function_types)


def test_linked_to_previous_type_literals(context: TaskContext):
    function_types = (
        context.model.pvmt.domains.by_name("Function Type")
        .groups.by_name("Logical Function Types")
        .property_values.by_name("Function Types")
    )
    assert function_types is not None, "Function Types not found"
    assert (
        function_types.type.name == "Type Literals"
    ), "Function Types should be linked to Type Literals"


def test_set_default_value(context: TaskContext):
    function_types = (
        context.model.pvmt.domains.by_name("Function Type")
        .groups.by_name("Logical Function Types")
        .property_values.by_name("Function Types")
    )
    assert function_types is not None, "Function Types not found"
    assert function_types.value.name == "Security", "Default value should be 'Security'"


def test_add_description(context: TaskContext):
    function_types = (
        context.model.pvmt.domains.by_name("Function Type")
        .groups.by_name("Logical Function Types")
        .property_values.by_name("Function Types")
    )
    assert function_types is not None, "Function Types not found"
    assert len(function_types.description) > 10, "Description is too short"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_created_enumeration_property,
        ),
        TaskDefinition(
            id=2,
            validator=test_linked_to_previous_type_literals,
        ),
        TaskDefinition(
            id=3,
            validator=test_set_default_value,
        ),
        TaskDefinition(
            id=4,
            validator=test_add_description,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
