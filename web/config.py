"""
(c) 2019 Minwoo Choo All rights reserved. :: Petective
"""

import sys
import os
from dotenv import load_dotenv
from pathlib import Path
from datetime import timedelta, datetime

basedir = os.path.dirname(os.path.abspath(__file__))
env_path = Path(os.path.join(basedir, "..")) / '.env'
load_dotenv(dotenv_path=env_path)

prevdir = basedir[:basedir.rfind('/')]
sys.path.append(basedir)
sys.path.append(prevdir)


def is_linux_system():
    return sys.platform == "linux" or sys.platform == "linux2"


if not is_linux_system():
    os.environ['DB_SERVICE'] = "localhost"


class BaseConfig(object):
    VERSION = os.environ['VERSION']
    SECRET_KEY = os.environ['SECRET_KEY']
    JWT_SECRET_KEY = os.environ['SECRET_KEY']
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=60)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=90)
    DEBUG = bool(int(os.environ['DEBUG']))
    DB_NAME = os.environ['DB_NAME']
    DB_USER = os.environ['DB_USER']
    DB_PASS = os.environ['DB_PASS']
    DB_SERVICE = os.environ['DB_SERVICE']
    DB_PORT = os.environ['DB_PORT']
    SQLALCHEMY_DATABASE_URI = 'postgresql://{0}:{1}@{2}:{3}/{4}'.format(
        DB_USER, DB_PASS, DB_SERVICE, DB_PORT, DB_NAME
    )
    REDIS_NAME = os.environ['REDIS_NAME']
    REDIS_PORT = int(os.environ['REDIS_PORT'])
    SQLALCHEMY_TRACK_MODIFICATIONS = bool(int(os.environ[
        'SQLALCHEMY_TRACK_MODIFICATIONS'
    ]))
    FREEPASS_PASSWORD = os.environ['FREEPASS_PASSWORD']
    SIGNUP_SECRET_KEY = os.environ['SIGNUP_SECRET_KEY']
    RESET_PASSWORD_SECRET_KEY = os.environ['RESET_PASSWORD_SECRET_KEY']
    APP_HOST = os.environ['APP_HOST']
    APP_PORT = os.environ['APP_PORT']
    LOGGER_ROOT_PATH = os.environ['LOGGER_ROOT_PATH']

    IMAGE_URI = os.environ['IMAGE_URI']
    SEQUENTIAL_IMAGE_URI = os.environ['SEQUENTIAL_IMAGE_URI']
