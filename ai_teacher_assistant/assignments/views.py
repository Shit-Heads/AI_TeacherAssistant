from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.decorators import login_required
import firebase_admin
from firebase_admin import credentials, firestore
from django.conf import settings
from authentication.models import UserProfile

#  Initialize Firestore (Directly using Service Account Key)
SERVICE_ACCOUNT_PATH = settings.FIREBASE_TOKEN  # Change this to your actual path

# Check if the app is already initialized and delete it if necessary
if firebase_admin._apps:
    firebase_admin.delete_app(firebase_admin.get_app())

cred = credentials.Certificate(SERVICE_ACCOUNT_PATH)
firebase_admin.initialize_app(cred)

db = firestore.client()

#  Render the Assignments Page
@csrf_exempt
@login_required
def assignments_view(request):
    return render(request, "../static/templates/assignments.html")  # Assuming this template is inside templates/

#  Add Assignment to Firestore
@csrf_exempt
@login_required
def create_assignment(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            
            # Fetch the subject name using the subject ID
            subject_id = data.get("subject")
            if not subject_id:
                return JsonResponse({"error": "Subject ID is required."}, status=400)

            subject_doc = db.collection("subjects").document(subject_id).get()
            if not subject_doc.exists:
                return JsonResponse({"error": "Subject not found."}, status=404)

            subject_name = subject_doc.to_dict().get("subject_name")
            if not subject_name:
                return JsonResponse({"error": "Subject name is missing in the database."}, status=400)

            # Replace subject ID with subject name in the data
            data["subject"] = subject_name

            # Add document to Firestore
            assignment_ref = db.collection("assignments").add(data)
            
            return JsonResponse({"message": "Assignment added successfully!", "id": assignment_ref[1].id}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

#  Fetch Assignments from Firestore
@csrf_exempt
@login_required
def get_assignments(request):
    try:
        assignments_ref = db.collection("assignments").stream()
        assignments = [{"id": doc.id, **doc.to_dict()} for doc in assignments_ref]
        return JsonResponse({"assignments": assignments}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

#  Delete Assignment from Firestore
@csrf_exempt
@login_required
def delete_assignment(request, assignment_id):
    try:
        db.collection("assignments").document(assignment_id).delete()
        return JsonResponse({"message": "Assignment deleted successfully!"}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

@login_required
def dashboard(request):
    submissions = db.collection("submissions").get()
    sub_count = len(submissions)
    graded = db.collection("ai_assessments").get()
    graded_count = len(graded)
    pending = max(sub_count - graded_count, 0)

    time_saved = graded_count * 4

    assignments = db.collection("assignments").stream()
    assignments_data = [{"id": doc.id, **doc.to_dict()} for doc in assignments]
    return render(
        request,
        "../static/templates/dashboard.html",
        {
            "assignments": assignments_data,
            "pending": pending,
            "graded": graded_count,
            "time_saved": time_saved,
        },
    )

@csrf_exempt
@login_required
def createsub(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            print("data received")
            
            subject_name = data.get("subject_name")
            number_of_students = data.get("number_of_students")
            class_name = data.get("class")

            if not all([subject_name, number_of_students, class_name]):
                return JsonResponse({"error": "All fields are required."}, status=400)

            subject_data = {
                "subject_name": subject_name,
                "number_of_students": number_of_students,
                "class": class_name,
            }
            subject_ref = db.collection("subjects").add(subject_data)
            
            return JsonResponse({"message": "Subject added successfully!", "id": subject_ref[1].id}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)   

@login_required
def get_subjects(request):
    if request.method == "GET":
        try:
            subject = db.collection("subjects").stream()  
            subjects_data = [{"id": sub.id, "name": sub.to_dict().get("subject_name")} for sub in subject]
            print("Subjects sent")
            return JsonResponse({"subjects": subjects_data}, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method."}, status=400)
