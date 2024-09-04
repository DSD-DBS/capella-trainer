from capella_trainer.tasks import TaskList, TaskDefinition, TaskContext


def test_new_component_was_created_in_dining_room(context: TaskContext):
    dining_room = context.model.pa.all_components.by_name("Dining Room")
    expected_components = 4
    assert (
        len(dining_room.components) == expected_components
    ), f"Dining room has {len(dining_room.components)} components, expected {expected_components}"
    return True


def test_new_component_was_renamed_to_smart_speaker(context: TaskContext):
    smart_speaker = context.model.pa.all_components.by_name("Smart Speaker")
    assert (
        smart_speaker is not None
    ), "Smart Speaker component not found, did you create it / is the name right?"
    return True


def test_new_component_was_set_to_device(context: TaskContext):
    assert False, "Not implemented"


def test_new_component_was_set_to_audio_device(context: TaskContext):
    assert False, "Not implemented"


tasks = TaskList(
    [
        TaskDefinition(
            description="Create a new physical component in the Dining Room",
            validator=test_new_component_was_created_in_dining_room,
        ),
        TaskDefinition(
            description="Rename that new component to 'Smart Speaker'",
            validator=test_new_component_was_renamed_to_smart_speaker,
        ),
        TaskDefinition(
            description="Set its type to 'device'",
            validator=test_new_component_was_set_to_device,
        ),
        TaskDefinition(
            description="Set its device type to 'Audio Device'",
            validator=test_new_component_was_set_to_audio_device,
        ),
    ]
)

tasks.load_model_from_path("training/02-first-tests/model/PVMT_Demo.aird")
