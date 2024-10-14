import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_created_background_colors(context: TaskContext):
    try:
        type_literals = context.model.pvmt.domains.by_name(
            "Function Type"
        ).enumeration_property_types.by_name("Type Literals")
    except KeyError:
        type_literals = None
    assert (
        type_literals is not None
    ), "Did you create a new Enumeration Literal in the previous task?"

    assert len(type_literals.literals) == 4, "There should be 4 literals in total"


def test_set_colors(context: TaskContext):
    type_literals = context.model.pvmt.domains.by_name(
        "Function Type"
    ).enumeration_property_types.by_name("Type Literals")

    color_map = {
        "Security": "200,106,2,0",
        "Temperature": "255,80,80,0",
        "Light": "255,254,96,0",
        "Audio": "64,131,191,0",
    }

    for literal in type_literals.literals:
        assert literal.name in color_map, f"Literal {literal.name} not expected"
        assert any(
            property_value.name == "__COLOR__"
            and property_value.value == color_map[literal.name]
            for property_value in literal.property_values
        ), f"Color for {literal.name} is not correct"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_created_background_colors,
        ),
        TaskDefinition(
            id=2,
            validator=test_set_colors,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
