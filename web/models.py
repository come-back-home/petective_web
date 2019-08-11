from datetime import datetime
from werkzeug import check_password_hash, generate_password_hash
from flask_sqlalchemy import SQLAlchemy

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import (
    create_engine, Column, String, Integer, DateTime, ForeignKey)
from sqlalchemy.orm import sessionmaker

from config import BaseConfig

base_config = BaseConfig()
db = create_engine(base_config.SQLALCHEMY_DATABASE_URI,
                   isolation_level="READ COMMITTED")
# base = declarative_base()
Session = sessionmaker(db)
session = Session()

db = SQLAlchemy()


class BaseModel(db.Model):
    """Base data model for all objects"""
    __abstract__ = True

    def __init__(self, *args):
        super().__init__(*args)

    def __repr__(self):
        """Define a base way to print models"""
        return '%s(%s)' % (self.__class__.__name__, {
            column: value
            for column, value in self._to_dict().items()
        })

    def json(self):
        """
        Define a base way to jsonify models, dealing with datetime objects
        """
        return {
            column: value if not isinstance(value, datetime.date)
            else value.strftime('%Y-%m-%d')
            for column, value in self._to_dict().items()
        }


class User(BaseModel, db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    name = Column(String(300))
    email = Column(String(300))
    phone = Column(String(100))
    #address = Column(String(300))
    location_id = Column(Integer, ForeignKey('location.id'))
    shelter = Column(Integer)  # 0: Not shelter, 1: Shelter
    password = Column(String(300))
    created_at = Column(DateTime)
    level = Column(Integer)

    def __init__(self, name, email, phone, address, location_id, shelter, password, level=0):
        self.name = name
        self.email = email
        self.phone = phone
        self.location_id = location_id
        self.shelter = shelter
        self.created_at = datetime.now()
        self.password = password
        self.level = level

    def _to_dict(self):
        return {
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at,
            "password": self.password,
            "level": self.level
        }

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)

    def is_active(self):
        """True, as all users are active."""
        return True

    def get_id(self):
        """Return the email address to satisfy Flask-Login's requirements."""
        return self.id

    def is_authenticated(self):
        """Return True if the user is authenticated."""
        return self.authenticated

    def is_anonymous(self):
        """False, as anonymous users aren't supported."""
        return False


class LoginSession(BaseModel, db.Model):
    __tablename__ = 'login_session'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    jti = Column(String(500))
    created_at = Column(DateTime)

    def __init__(self, user_id, jti):
        self.user_id = user_id
        self.jti = jti
        self.created_at = datetime.now()


class Images(BaseModel, db.Model):
    __tablename__ = 'images'

    id = Column(Integer, primary_key=True)
    path = Column(String(1000))
    created_at = Column(DateTime)

    def __init__(self, path):
        self.path = path
        self.created_at = datetime.now()


class SequentialImages(BaseModel, db.Model):
    __tablename__ = 'sequential_images'

    id = Column(Integer, primary_key=True)
    path = Column(String(1000))
    trained = Column(db.Integer)  # 0: Not trained, 1: Trained
    created_at = Column(DateTime)

    def __init__(self, path, trained):
        self.path = path
        self.trained = trained
        self.created_at = datetime.now()


class Location(BaseModel, db.Model):
    __tablename__ = 'location'

    id = Column(Integer, primary_key=True)
    #user_id = Column(Integer, ForeignKey('users.id'))
    name = Column(String(500))
    address = Column(String(1000))
    shelter = Column(Integer)  # 0: Not shelter, 1: Shelter
    created_at = Column(DateTime)

    def __init__(self, name, address, shelter):
        #self.user_id = user_id
        self.name = name
        self.address = address
        self.shelter = shelter
        self.created_at = datetime.now()


class MyPet(BaseModel, db.Model):
    __tablename__ = 'mypet'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    location_id = Column(Integer, ForeignKey('location.id'))
    name = Column(String(300))
    sex = Column(String(10))  # "Male" or "Female"
    created_at = Column(DateTime)

    def __init__(self, user_id, location_id, name, sex):
        self.user_id = user_id
        self.location_id = location_id
        self.name = name
        self.sex = sex
        self.created_at = datetime.now()


