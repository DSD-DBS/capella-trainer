import os.path

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_new_component_was_created_in_dining_room(context: TaskContext):
    projects = context.client.get(f"/projects").json()
    for project in projects:
        print(context.client.post(f"/projects/{project['name']}/save").read())

    dining_room = context.model.pa.all_components.by_name("Dining Room")
    print(dining_room.components)
    expected_components = 3
    assert (
        len(dining_room.components) == expected_components
    ), 'You did not create a "physical component". Please create one by looking into the Palette on the right. If you don\'t find your Palette or it has been closed or hidden: Window > Show View > Palette'


def test_new_component_was_renamed_to_radio(context: TaskContext):
    try:
        radio = context.model.pa.all_components.by_name(
            "Dining Room"
        ).components.by_name("Radio")
    except:
        radio = None
    assert (
        radio is not None
    ), 'You did not name it "Radio", please use the exactly the name.'


def test_assign_types_to_radio(context: TaskContext):
    radio = context.model.pa.all_components.by_name("Dining Room").components.by_name(
        "Radio"
    )
    assert (
        radio.property_value_groups["SmartHome_General_Setup.Extension_Types"][
            "Types_Enum"
        ].name
        == "Devices"
    ), "The property Types_Enum is not set to Devices"

    assert (
        radio.property_value_groups["SmartHome_General_Setup.Extension_Devices"][
            "Devices_Types"
        ].name
        == "Audio_Device"
    ), "The property Devices_Types is not set to Audio_Device"


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_new_component_was_created_in_dining_room,
        ),
        TaskDefinition(
            id=2,
            validator=test_new_component_was_renamed_to_radio,
        ),
        TaskDefinition(
            id=3,
            validator=test_assign_types_to_radio,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
