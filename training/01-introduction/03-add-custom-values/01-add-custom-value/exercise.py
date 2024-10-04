import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_assign_consumption_to_radio(context: TaskContext):
    radio = context.model.pa.all_components.by_name("Dining Room").components.by_name(
        "Radio"
    )
    assert (
        radio.property_value_groups["SmartHome_Energy.Extension_Energy"][
            "Standby Energy Consumption"
        ]
        == 5
    ), "The property Standby Energy Consumption is not set to 5"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_assign_consumption_to_radio,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
