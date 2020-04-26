import sqlite3
import os
import json
import time
import uuid

from webapp import return_resp


def get_unique_id():
    new_uuid = uuid.uuid4()

    does_it_exist = query_db("SELECT count(*) as present FROM Session WHERE `uuid`='" + str(new_uuid) + "'")[0]['present'] > 0
    if does_it_exist:
        return get_unique_id()

    return new_uuid


def get_from_json(json, key):
    try:
        return json[key]
    except:
        return None

'''
Database file, local
'''
DATABASE = "experiment_tracking.db"

'''
This method gets a connection to the local database
'''
def get_db():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = lambda c, r: dict([(col[0], r[idx]) for idx, col in enumerate(c.description)]) ##This makes database queries return data in a dictionary

    return conn


def create_new_session(session_info):
    orders = get_orders()

    min_experiment_count = get_minimum_completed_amount()
    possible_orders_to_choose = list(filter(lambda k: k['completedExperiments'] == min_experiment_count, orders))

    order_by_ongoing_sessions = sorted(possible_orders_to_choose, key= lambda k: get_incomplete_sessions_for_order(k['id']))

    return create_session_for_order(order_by_ongoing_sessions[0]['id'], session_info)


def create_session_for_order(order_id, session_info):
    the_uuid = get_unique_id()

    expires_at = int(time.time()) + 86400

    update_db("INSERT INTO Session (`uuid`, `orderId`, `completed`, `invalidAfter`) VALUES ('" + str(the_uuid) + "'," + str(order_id) + ", 0, " + str(expires_at) + ")")

    newly_created_experiment = get_experiment_by_uuid(the_uuid)

    update_db("INSERT INTO SessionInfo ("
              "`sessionId`, "
              "`initials`,"
              " `age`,"
              " `gender`, "
              "`percentMammo`,"
              " `yearsExperience`,"
              " `casesPerYear`,"
              " `screenSizeCm`, "
              "`imagePixels`, "
              "`screenDimensions`)"
              " VALUES ("
              "" + str(newly_created_experiment['id']) + ", "
              "'" + str(get_from_json(session_info, 'initials')) + "',"
              "'" + str(get_from_json(session_info, 'age')) + "',"
              "'" + str(get_from_json(session_info, 'gender')) + "',"
              "'" + str(get_from_json(session_info, 'percentMammo')) + "',"
              "'" + str(get_from_json(session_info, 'yearsExperience')) + "',"
              "'" + str(get_from_json(session_info, 'casesPerYear')) + "',"
              "'" + str(get_from_json(session_info, 'screenSizeCm')) + "',"
              "'" + str(get_from_json(session_info, 'imagePixels')) + "',"
              "'" + str(get_from_json(session_info, 'screenDimensions')) + "'"
              ")")


    return {
        "uuid": str(the_uuid),
        "order": json.loads(get_order_by_id(order_id)['order'])
    }


def complete_experiment(experiment_id, results):
    this_experiment = get_experiment_by_uuid(experiment_id)

    if this_experiment['completed'] == 1:
        return return_resp({
            "message": "Experiment is already complete"
        }, 400)

    update_db("UPDATE Session SET `results`='" + str(results).replace("'", "\"") + "', `completed`= 1 WHERE `uuid`='" + experiment_id + "'")

    current_count = get_order_by_id(this_experiment['orderId'])['completedExperiments']
    update_db("UPDATE Orders SET `completedExperiments`=" + str(current_count + 1) + " WHERE `id`=" + str(this_experiment['orderId']))

    filename = os.getcwd() + "/results/" + str(experiment_id) + ".txt"
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, "w") as f:
        f.write(str(results))
        f.close()

    return return_resp({"message": "Experiment Complete!"}, 200)



def get_minimum_completed_amount():
    result = query_db("SELECT min(Orders.completedExperiments) as minimum from Orders")
    return result[0]['minimum']


def get_incomplete_sessions_for_order(order_id):
    results = query_db("SELECT count(*) as amount from Session WHERE `orderId`=" + str(order_id) + " AND `completed`=0 AND `invalidAfter`>" + str(int(time.time())))
    return results[0]['amount']


def get_experiment_by_uuid(experiment_uuid):
    result = query_db("SELECT * FROM Session WHERE `uuid`='" + str(experiment_uuid) + "'")
    return result[0]

def get_order_by_id(order_id):
    result = query_db("SELECT * FROM Orders WHERE `id`=" + str(order_id))
    return result[0]

def get_orders():
    result = query_db("SELECT * FROM `Orders`")
    return result


'''
This method runs update methods to the database.
Doesn't return anything
'''
def update_db(query):
    db = get_db()

    c = db.cursor()

    c.execute(query)

    db.commit()
    db.close()


'''
This method sends a query to the local database and returns the result
'''
def query_db(query, args = ()):
    db = get_db()

    cur = db.cursor();
    cur.execute(query, args)
    rs = cur.fetchall()
    cur.close()
    return rs
