#!/usr/bin/env python3
"""A Basic Flask app."""
import pytz
from flask_babel import Babel
from typing import Union, Dict
from flask import Flask, render_template, request, g


class Config:
    """
    A Flask Babel configuration.
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.url_map.strict_slashes = False
babel = Babel(app)
users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


def get_user() -> Union[Dict, None]:
    """
    Retrieves a user based on the user id.
    """
    user_id = request.args.get('login_as', '')
    if user_id:
        return users.get(int(user_id), None)
    return None


@app.before_request
def before_request() -> None:
    """
    Get's the user before each request.
    """
    user = get_user()
    g.user = user


@babel.localeselector
def get_locale() -> str:
    """
    Retrieves the locale for a web page.
    """
    locale = request.args.get('locale', '')
    if locale in app.config["LANGUAGES"]:
        return locale
    if g.user and g.user['locale'] in app.config["LANGUAGES"]:
        return g.user['locale']
    locale_header = request.headers.get('locale', '')
    if locale_header in app.config["LANGUAGES"]:
        return locale_header
    return app.config['BABEL_DEFAULT_LOCALE']


@babel.timezoneselector
def get_timezone() -> str:
    """Retrieves the timezone for a web page.
    """
    timezone = request.args.get('timezone', '').strip()
    if not timezone and g.user:
        timezone = g.user['timezone']
    try:
        return pytz.timezone(timezone).zone
    except pytz.exceptions.UnknownTimeZoneError:
        return app.config['BABEL_DEFAULT_TIMEZONE']


@app.route('/')
def get_index() -> str:
    """
    The home page.
    """
    return render_template('7-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
