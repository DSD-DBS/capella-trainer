# Copyright DB InfraGO AG and contributors
# SPDX-License-Identifier: Apache-2.0

from pydantic import BaseModel, Field


class Element(BaseModel):
    name: str = Field(description="Display name of the element.")
    path: list[str] = Field(description="Path to the element.")
    slug: str = Field(description="Filename of the element.")
    type: str = Field(description="Type of the element.")
