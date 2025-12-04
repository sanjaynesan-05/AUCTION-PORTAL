from pydantic import BaseModel
from typing import List


class TeamBase(BaseModel):
    name: str
    shortName: str
    purse: int
    logo: str
    color: str
    primaryColor: str
    secondaryColor: str


class TeamCreate(TeamBase):
    pass


class TeamUpdate(BaseModel):
    purse: int


class Team(TeamBase):
    id: int
    players: List[int] = []

    class Config:
        from_attributes = True
