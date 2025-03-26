from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import firebase_admin
from firebase_admin import credentials, firestore

#  Initialize Firestore (Directly using Service Account Key)
SERVICE_ACCOUNT_PATH = r"C:\Users\gowth\Projects\recipe_data_django\AI_TeacherAssistant\ai_teacher_assistant\serviceAccountKey.json"  # Change this to your actual path
if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

#  Render the Assignments Page
def assignments_view(request):
    return render(request, "../static/templates/assignments.html")  # Assuming this template is inside templates/

#  Add Assignment to Firestore
@csrf_exempt
def create_assignment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # Add document to Firestore
            assignment_ref = db.collection("assignments").add(data)
            
            return JsonResponse({"message": "Assignment added successfully!", "id": assignment_ref[1].id}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

#  Fetch Assignments from Firestore
def get_assignments(request):
    try:
        assignments_ref = db.collection("assignments").stream()
        assignments = [{"id": doc.id, **doc.to_dict()} for doc in assignments_ref]
        return JsonResponse({"assignments": assignments}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

#  Delete Assignment from Firestore
@csrf_exempt
def delete_assignment(request, assignment_id):
    try:
        db.collection("assignments").document(assignment_id).delete()
        return JsonResponse({"message": "Assignment deleted successfully!"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
