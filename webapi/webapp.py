##pip install flask
##pip install sqlite3
from flask import Flask, request, Response, make_response, redirect

import json
import os
import db_manager

app = Flask(__name__)

row2dict = lambda r: {c.name: str(getattr(r, c.name)) for c in r.__table__.columns}

def return_resp(mess, code):
    resp = make_response(mess, code)
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp

# @app.before_request
# def before_request():
#     if request.url.startswith('http://'):
#         url = request.url.replace('http://', 'https://', 1)
#         code = 301
#         return redirect(url, code=code)


@app.route('/')
def hello():
    return "Welcome to the experiment", 200


@app.route('/session/create', methods=['POST'])
def create_session():
    raw_body = str(request.data)[2: -1]

    if raw_body is '':
        return "{\"error\":\"No Body\"}", 400

    body = json.loads(raw_body)

    if len(body) == 0:
        return "{\"error\":\"No Body\"}", 400

    wanted_keys = [
        "initials",
        "age",
        "gender",
        "percentMammo",
        "yearsExperience",
        "casesPerYear",
        "screenSizeCm",
        "imagePixels",
        "screenDimensions"
    ]

    for key in wanted_keys:
        if key not in body:
            return return_resp("{\"error\":\"Incomplete Body: missing " + str(key) + "\"}", 400)

    return return_resp(db_manager.create_new_session(body), 200)


@app.route("/session/complete", methods=['POST'])
def complete_experiment():
    raw_body = request.data

    if raw_body is None:
        return "{\"error\":\"No Body\"}", 400

    body = json.loads(str(raw_body)[2: -1])

    if len(body) == 0:
        return return_resp("{\"error\":\"No Body\"}", 400)

    try:
        experiment_uuid = body['uuid']
        result = body['result']
    except:
        return return_resp("{\"error\":\"Invalid Body\"}", 400)

    return db_manager.complete_experiment(experiment_uuid, result)


if __name__ == '__main__':
    app.run(host='0.0.0.0')