# from datetime import datetime
from marshmallow import fields
from marshmallow_sqlalchemy import ModelSchema
from models import (
    User, LoginSession, Images, SequentialImages, Location, MyPet
)


class UserSchema(ModelSchema):
    class Meta:
        model = User


class LoginSessionSchema(ModelSchema):
    user = fields.Nested(UserSchema)

    class Meta:
        model = LoginSession


class ImagesSchema(ModelSchema):
    class Meta:
        model = Images


class SequentialImagesSchema(ModelSchema):
    class Meta:
        model = SequentialImages


class LocationSchema(ModelSchema):
    class Meta:
        model = Location


class MyPetSchema(ModelSchema):
    class Meta:
        model = MyPet
