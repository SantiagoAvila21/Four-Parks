from flask import Flask, Response
from flask_mail import Mail
from flask_cors import CORS
from app.config import Config
from app.utils.db_utils import get_db_connection

mail = Mail()

def create_app():
    app = Flask(__name__, template_folder='templates')
    app.config.from_object(Config)
    
    mail.init_app(app)
    CORS(app)
    
    from app.routes.auth_routes import auth_bp
    from app.routes.user_routes import user_bp
    from app.routes.reserva_routes import reserva_bp
    from app.routes.parqueadero_routes import parqueadero_bp
    
    from flask import request

    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(reserva_bp)
    app.register_blueprint(parqueadero_bp)


    @app.before_request
    def handle_preflight():
        if request.method == "OPTIONS":
            res = Response()
            res.headers['X-Content-Type-Options'] = '*'
            return res

    
    return app
