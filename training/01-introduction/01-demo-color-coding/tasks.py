import random

from capella_trainer.tasks import TaskList, TaskDefinition, TaskContext


def check(context: TaskContext):
    assert 1 + 1 == 2, "This should not get triggered"


def random_check(context: TaskContext):
    number = random.randint(1, 10)
    assert number >= 5, f"Random number was {number}, expected at least 5"


def never_check(context: TaskContext):
    assert False, "This should never be completed"


tasks = TaskList(
    [
        TaskDefinition(description="Add 1 + 1", validator=check),
        TaskDefinition(description="This is random chance", validator=random_check),
        TaskDefinition(
            description="This will never be complete", validator=never_check
        ),
    ]
)
