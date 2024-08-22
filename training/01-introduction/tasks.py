import random

from capella_trainer.tasks import TaskList, TaskDefinition


def check(model):
    assert 1 + 1 == 2, "This should not get triggered"


def random_check(model):
    number = random.randint(1, 10)
    assert number >= 5, f"Random number was {number}, expected at least 5"


def never_check(model):
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
