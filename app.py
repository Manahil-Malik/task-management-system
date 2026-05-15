from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)

# MongoDB connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/taskdb"

mongo = PyMongo(app)

# Home route
@app.route("/")
def home():
    return "API Running"


# CREATE TASK
@app.route('/tasks', methods=['POST'])
def create_task():

    data = request.json

    task = {
        "title": data["title"],
        "description": data["description"],
        "status": data["status"],
        "dueDate": data["dueDate"]
    }

    mongo.db.tasks.insert_one(task)

    return jsonify({"message": "Task created"})


# GET ALL TASKS
@app.route('/tasks', methods=['GET'])
def get_tasks():

    tasks = []

    for task in mongo.db.tasks.find():

        tasks.append({
            "_id": str(task["_id"]),
            "title": task["title"],
            "description": task["description"],
            "status": task["status"],
            "dueDate": task["dueDate"]
        })

    return jsonify(tasks)


# UPDATE TASK
@app.route('/tasks/<id>', methods=['PUT'])
def update_task(id):

    data = request.json

    mongo.db.tasks.update_one(
        {"_id": ObjectId(id)},
        {
            "$set": {
                "title": data["title"],
                "description": data["description"],
                "status": data["status"],
                "dueDate": data["dueDate"]
            }
        }
    )

    return jsonify({"message": "Task updated"})


# DELETE TASK
@app.route('/tasks/<id>', methods=['DELETE'])
def delete_task(id):

    mongo.db.tasks.delete_one(
        {"_id": ObjectId(id)}
    )

    return jsonify({"message": "Task deleted"})


if __name__ == "__main__":
    app.run(debug=True)