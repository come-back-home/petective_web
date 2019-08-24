import os
import logger
from datetime import datetime
from flask import (
    Flask, render_template, jsonify, request, abort,
    send_from_directory)
from flask_restful import Resource, Api
from flask_cors import CORS
from flask_migrate import Migrate
from flask_socketio import SocketIO
from htmlmin.main import minify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import (
    JWTManager, create_access_token, create_refresh_token,
    jwt_required, jwt_refresh_token_required, get_jwt_identity,
    get_jti, get_raw_jwt)
from models import (
    db, User, LoginSession, Images, SequentialImages, Location, MyPet
)
from serializer import (
    UserSchema, LoginSessionSchema, LocationSchema
)
from config import BaseConfig
from utils import get_ip_address

base_config = BaseConfig()
LOGGER_ROOT_PATH = base_config.LOGGER_ROOT_PATH
LOG = logger.get_root_logger(
    __name__, filename=os.path.join(LOGGER_ROOT_PATH, 'output.log'))


app = Flask(__name__)
app.config.from_object(BaseConfig)
db.init_app(app)
migrate = Migrate(app, db)
api = Api(app)
flask_bcrypt = Bcrypt(app)
jwt = JWTManager(app)
cors = CORS(app)
socketio = SocketIO(app)


def query_serializer(schema, query_result):
    ret = []
    for result in query_result:
        ret.append(schema.dump(result).data)
    return ret


def get_request_arg(key, base_value):
    try:
        result = request.args.get(key, base_value)
    except ValueError:
        result = base_value
    return result


@app.after_request
def response_minify(response):
    if response.content_type == u'text/html; charset=utf-8':
        response.set_data(
            minify(response.get_data(as_text=True))
        )
        return response
    return response


@jwt.unauthorized_loader
def unauthorized_response(callback):
    return jsonify({
        'ok': False,
        'message': 'Missing Authorization Header'
    }), 401


@app.route('/<filename>')
def get_service_worker(filename):
    basedir = os.path.dirname(os.path.abspath(__file__))
    path = os.path.join(basedir, 'static', 'js')
    if os.path.exists(os.path.join(path, filename)):
        return send_from_directory(path, filename)
    return jsonify({"message": "{} is not exists".format(filename)})


@app.route('/')
def home():
    # db = MongoConnector().get()
    return render_template('index.html')


class UserList(Resource):
    @jwt_required
    def get(self):
        users = User.query.all()
        return jsonify(list(map(lambda x: x.json(), users)))

    def post(self):
        return jsonify({})

    def put(self):
        data = request.get_json()
        try:
            email = data['email']
            password = data['password']
            secret_key = data['secretKey']
        except Exception as e:
            abort(400, e)
        if secret_key != BaseConfig.RESET_PASSWORD_SECRET_KEY:
            abort(400, "Invalid reset password key")
        user = User.query.filter_by(email=email).first()
        if user is None:
            abort(400, "{} is not exists".format(email))
        hashpass = flask_bcrypt.generate_password_hash(
            password).decode('utf-8')
        user.password = hashpass
        try:
            db.session.commit()
        except Exception as e:
            abort(500, e)
        serialized_result = query_serializer(UserSchema(), [user])[0]
        return jsonify(serialized_result)


class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        try:
            email = data['email']
            password = data['password']
        except Exception as e:
            print(e)
            abort(400)
        user = User.query.filter_by(email=email).first()
        if user and flask_bcrypt.check_password_hash(
                user.password, password):
            _user = query_serializer(UserSchema(), [user])[0]
            _user['login_at'] = datetime.now()
            del _user['password']
            access_token = create_access_token(identity=_user)
            refresh_token = create_refresh_token(identity=_user)
            jti = get_jti(refresh_token)
            _user['token'] = access_token
            _user['refresh'] = refresh_token
            login_session = LoginSession.query.filter_by(
                user_id=user.id).first()
            if login_session:
                login_session.jti = jti
            else:
                new_login_session = LoginSession(
                    user.id, jti)
                db.session.add(new_login_session)
            try:
                db.session.commit()
            except Exception as e:
                print(e)
                abort(400, e)
            return jsonify({'ok': True, 'data': _user})
        else:
            abort(400, "email or password is incorrect")


class UserRegister(Resource):
    def post(self):
        data = request.get_json()
        try:
            name = data['name'].strip()
            email = data['email'].strip()
            password = data['password'].strip()
            phone = "010-0000-0000"  # data['phone'].strip()
            address = "test"  # data['address'].strip()
            shelter = 0  # data['shelter'].strip()
            signup_key = data['secretKey'].strip()
        except Exception as e:
            print(e)
            abort(400)
        if signup_key != app.config['SIGNUP_SECRET_KEY']:
            abort(400, "Secret Key is unavailable")

        password = flask_bcrypt.generate_password_hash(
            password).decode('utf-8')
        user = User.query.filter_by(email=email).first()
        if user:
            abort(400, 'User created already!')
        else:
            new_location = Location(name, address, shelter)
            db.session.add(new_location)
            try:
                db.session.commit()
            except Exception as e:
                abort(500, e)

            new_user = User(name, email, phone, new_location.id, shelter, password)
            db.session.add(new_user)
            try:
                db.session.commit()
            except Exception as e:
                abort(500, e)
        return jsonify({'ok': True, 'message': 'User created successfully!'})


class UserRefresh(Resource):
    @jwt_refresh_token_required
    def post(self):
        current_user = get_jwt_identity()
        login_session = LoginSession.query.filter_by(
            user_id=current_user['id']).first()
        if login_session is None:
            abort(401)
        raw_jwt = get_raw_jwt()
        jti = raw_jwt['jti']
        if login_session.jti != jti:
            abort(401)
        ret = {
            'token': create_access_token(identity=current_user)
        }
        return jsonify({'ok': True, 'data': ret})


api.add_resource(UserList, '/api/users')
api.add_resource(UserLogin, '/api/auth/login')
api.add_resource(UserRegister, '/api/auth/register')
api.add_resource(UserRefresh, '/api/auth/refresh')


if __name__ == '__main__':
    ip_address = get_ip_address()
    # app.run(host=ip_address, port=BaseConfig.APP_PORT)
    app.run(host=BaseConfig.APP_HOST, port=BaseConfig.APP_PORT, debug=True, threaded=True)
