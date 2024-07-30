#!/usr/bin/env python3
"""
Force locale with URL parameter.
"""
from flask_babel import Babel
from flask import Flask, render_template, request


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


@babel.localeselector
def get_locale() -> str:
    """
    Retrieves the locale for a web page.
    """
    query_list = request.query_string.decode('utf-8').split('&')
    queries = dict(map(
        lambda x: (x if '=' in x else '{}='.format(x)).split('='),
        query_list,
    ))
    if 'locale' in queries:
        if queries['locale'] in app.config["LANGUAGES"]:
            return queries['locale']
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@app.route('/')
def get_index() -> str:
    """
    The home page.
    """
    return render_template('4-index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
