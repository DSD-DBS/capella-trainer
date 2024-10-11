import os

from capella_trainer.exercise import TaskList, TaskDefinition, TaskContext


def test_created_motion_detection_system(context: TaskContext):
    motion_detection_system = context.model.la.all_components.by_name(
        "Motion detection system"
    )
    assert (
        motion_detection_system is not None
    ), "Please create the logical component 'Motion detection system'."


def test_created_detect_motion(context: TaskContext):
    any_detect_motion = context.model.la.all_functions.by_name("Detect motion")
    assert (
        any_detect_motion is not None
    ), "Please create the function 'Detect motion' inside the logical component 'Motion detection system'."

    motion_detection_system = context.model.la.all_components.by_name(
        "Motion detection system"
    )
    assert motion_detection_system is not None
    detect_motion = motion_detection_system.allocated_functions.by_name("Detect motion")
    assert (
        detect_motion is not None
    ), "Please create the function 'Detect motion' inside the logical component 'Motion detection system'."


def test_created_functional_exchange(context: TaskContext):
    function_exchange = context.model.la.all_function_exchanges.by_name(
        "Motion detect trigger"
    )
    assert (
        function_exchange is not None
    ), "Please create the functional exchange 'Motion detect trigger'."
    assert (
        function_exchange.source.parent.name == "Detect motion"
    ), "The source of the functional exchange 'Motion detect trigger' should be the function 'Detect motion'."
    assert (
        function_exchange.target.parent.name == "Activate camera"
    ), "The target of the functional exchange 'Motion detect trigger' should be the function 'Activate camera'."


tasks = TaskList(
    [
        TaskDefinition(
            id=1,
            validator=test_created_motion_detection_system,
        ),
        TaskDefinition(
            id=2,
            validator=test_created_detect_motion,
        ),
        TaskDefinition(
            id=3,
            validator=test_created_functional_exchange,
        ),
    ]
)


def setup(path):
    tasks.load_model_from_path(os.path.join(path, "PVMT_Demo.aird"))
