import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_created_enumeration_definition(context: TaskContext):
    enumeration_definitions = context.model.pvmt.domains.by_name(
        "Function Type"
    ).enumeration_property_types
    assert (
        len(enumeration_definitions) > 0
    ), "Create a new Enumeration Definition called 'Type Literals'"
    try:
        type_literals = enumeration_definitions.by_name("Type Literals")
    except KeyError:
        type_literals = None
    assert type_literals is not None, "Make sure to call it 'Type Literals'"
    assert any(
        type_literal.name == "Security" for type_literal in type_literals.literals
    ), "Create a literal called 'Security'"
    assert any(
        typed_literal.name == "Temperature" for typed_literal in type_literals.literals
    ), "Create a literal called 'Temperature'"
    assert any(
        typed_literal.name == "Light" for typed_literal in type_literals.literals
    ), "Create a literal called 'Light'"
    assert any(
        typed_literal.name == "Audio" for typed_literal in type_literals.literals
    ), "Create a literal called 'Audio'"
    assert len(type_literals.literals) == 4, "There should be 4 literals in total"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_created_enumeration_definition,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
