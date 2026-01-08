from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pymongo import MongoClient
from bson.objectid import ObjectId
import os

mongo_uri = 'mongodb://' + os.environ["MONGO_HOST"] + ':' + os.environ["MONGO_PORT"]
db = MongoClient(mongo_uri)['test_db']


class TodoListView(APIView):

    def get(self, request):
        todos = []
        for todo in db.todos.find():
            todos.append({
                "id": str(todo["_id"]),
                "heading": todo.get("heading"),
                "description": todo.get("description")
            })
        return Response(todos, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data

        heading = data.get("heading")
        description = data.get("description")

        if not heading or not description:
            return Response(
                {"error": "heading and description are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = db.todos.insert_one({
            "heading": heading,
            "description": description
        })

        return Response(
            {
                "message": "Todo created successfully",
                "id": str(result.inserted_id)
            },
            status=status.HTTP_201_CREATED
        )

    def delete(self, request, todo_id):
        try:
            result = db.todos.delete_one({"_id": ObjectId(todo_id)})

            if result.deleted_count == 0:
                return Response(
                    {"error": "Todo not found"},
                    status=status.HTTP_404_NOT_FOUND
                )

            return Response(
                {"message": "Todo deleted successfully"},
                status=status.HTTP_200_OK
            )

        except Exception:
            return Response(
                {"error": "Invalid todo id"},
                status=status.HTTP_400_BAD_REQUEST
            )

    def put(self, request):
        data = request.data

        todo_id = data.get("id")
        heading = data.get("heading")
        description = data.get("description")

        if not todo_id:
            return Response(
                {"error": "Todo id required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        update_data = {}

        if heading:
            update_data["heading"] = heading
        if description:
            update_data["description"] = description

        if not update_data:
            return Response(
                {"error": "Nothing to update"},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = db.todos.update_one(
            {"_id": ObjectId(todo_id)},
            {"$set": update_data}
        )

        if result.matched_count == 0:
            return Response(
                {"error": "Todo not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {"message": "Todo updated successfully"},
            status=status.HTTP_200_OK
        )
