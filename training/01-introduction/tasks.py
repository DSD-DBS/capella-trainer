from capella_trainer.tasks import TaskList, TaskDefinition


def check():
    assert 1 == 2, "1 is not 2"


tasks = TaskList([TaskDefinition(description="Something", validator=check)])

print(tasks.check_tasks())
