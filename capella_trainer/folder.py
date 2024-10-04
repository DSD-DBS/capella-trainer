import os

import yaml
from pydantic import Field
import typing as t

from capella_trainer.constants import TRAINING_DIR
from capella_trainer.element import Element
from capella_trainer.lesson import Lesson


class Folder(Element):
    children: list[t.Self | Lesson] = Field(description="List of lessons and folders.")
    type: str = Field(default="folder", description="Type of the element.")

    @staticmethod
    def from_path(path_name: list[str]):
        """
        Resolve the folder and its children
        :param path_name: folder name
        """
        children = []

        filesystem_path = os.path.join(TRAINING_DIR, *path_name)
        if not os.path.exists(filesystem_path):
            raise FileNotFoundError(f"Folder {path_name} not found.")

        if not os.path.isdir(filesystem_path):
            raise NotADirectoryError(f"{path_name} is not a folder.")

        folder_meta = os.path.join(filesystem_path, "folder.yaml")
        slug = len(path_name) > 0 and path_name[-1] or ""
        if os.path.exists(folder_meta):
            with open(folder_meta) as f:
                meta = yaml.safe_load(f)
                name = meta["name"]
        else:
            raise FileNotFoundError(f"folder.yaml not found in {path_name}")
        for file_name in sorted(os.listdir(filesystem_path)):
            # folders have a folder.yaml file
            # lessons have a content.mdx file
            # ignore other files
            if not os.path.isdir(os.path.join(filesystem_path, file_name)):
                continue

            if os.path.exists(os.path.join(filesystem_path, file_name, "folder.yaml")):
                children.append(Folder.from_path(path_name + [file_name]))
            elif os.path.exists(
                os.path.join(filesystem_path, file_name, "content.mdx")
            ):
                children.append(Lesson.from_path(path_name + [file_name]))

        return Folder(name=name, path=path_name, children=children, slug=slug)

    def get_child(self, path: list[str]) -> t.Self | Lesson:
        """
        Get the child folder or lesson by path
        :param path: path to the child
        """
        if not path:
            return self

        for child in self.children:
            if isinstance(child, Lesson) and child.slug == path[0]:
                return child
            if isinstance(child, Folder) and child.path[-1] == path[0]:
                return child.get_child(path[1:])

        raise FileNotFoundError(f"Child {path} not found.")
