from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
import firebase_admin
from firebase_admin import credentials, firestore
from google import genai
from google.genai import types
from difflib import SequenceMatcher  # For plagiarism detection
import re  # To extract JSON correctly

# Initialize Firebase
cred = credentials.Certificate(r"C:\Users\gowth\Projects\recipe_data_django\AI_TeacherAssistant\ai_teacher_assistant\serviceAccountKey.json")  # Update your path
firebase_admin.initialize_app(cred)
db = firestore.client()  # Firestore database instance

# Initialize the Vertex AI client
client = genai.Client(
    vertexai=True,
    project="total-velocity-451813-s3",
    location="us-central1"
)

def upload_view(request):
    """Render the upload.html template"""
    return render(request, '../static/templates/dashboard.html')

@csrf_exempt
def process_json(request):
    if request.method == 'POST':
        try:
            if 'file' not in request.FILES:
                return JsonResponse({'error': 'No file uploaded.'})
            
            uploaded_file = request.FILES['file']
            if not uploaded_file.name.endswith('.json'):
                return JsonResponse({'error': 'Only JSON files are allowed.'})
            
            file_content = uploaded_file.read().decode('utf-8')
            json_data = json.loads(file_content)

            # Extract submitted content
            submitted_content = json_data.get('content', '')
            plagiarism_percentage = 0

            # Check for plagiarism by comparing with Firestore data
            existing_assignments = db.collection("submissions").stream()
            for assignment in existing_assignments:
                existing_content = assignment.to_dict().get('content', '')
                similarity = SequenceMatcher(None, submitted_content, existing_content).ratio()
                if similarity > 0.8:  # If similarity > 80%, mark as plagiarized
                    plagiarism_percentage = similarity * 100
                    break

            # AI Grading Prompt
            prompt = f"""
            You are an AI grading assistant. 
            Respond ONLY with a valid JSON object and NOTHING else.

            *Assignment Details:*
            - Student Name: {json_data.get('student_name')}
            - Subject: {json_data.get('subject')}
            - Assignment: {json_data.get('assignment')}
            - Content: {json_data.get('content')}

            *Grading Criteria (Scores out of 5):*
            - Content Knowledge
            - Analysis
            - Organization
            - Plagiarism: {plagiarism_percentage}% (Plagiarism detected if >80%)

            Respond strictly in this JSON format:
            ```json
            {{
                "content_knowledge_score": 4,
                "analysis_score": 3,
                "organization_score": 4,
                "plagiarism_percentage": {plagiarism_percentage},
                "suggested_grade": "B (82%)",
                "suggested_feedback": "improvement and suggestions for the student"
            }}
            ```
            """

            model = "gemini-2.0-flash-001"
            contents = [prompt]

            generate_content_config = types.GenerateContentConfig(
                temperature=0.7,
                top_p=0.95,
                max_output_tokens=1024,
                response_modalities=["TEXT"],
            )

            response_text = ''.join([
                chunk.text for chunk in client.models.generate_content_stream(
                    model=model,
                    contents=contents,
                    config=generate_content_config
                )
            ])

            print(f"Raw AI Response: {response_text}")  # Debugging

            # Extract JSON using regex
            match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if match:
                response_text = match.group(0)
            else:
                return JsonResponse({'error': 'AI response is not valid JSON.', 'raw_response': response_text})

            ai_response = json.loads(response_text)

            # Add student details before saving to Firestore
            ai_response['student_name'] = json_data.get('student_name', 'Unknown')
            ai_response['subject'] = json_data.get('subject', 'Unknown')
            ai_response['assignment'] = json_data.get('assignment', 'Unknown')
            ai_response['plagiarism_percentage'] = plagiarism_percentage

            # Store in Firestore
            doc_ref = db.collection("ai_assessments").add(ai_response)
            ai_response['id'] = doc_ref[1].id  

            return JsonResponse(ai_response)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'AI response could not be parsed as JSON.', 'raw_response': response_text})
        except Exception as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'})



#----------------------------Submissions from the students will be shown from here--------------------------------


def submissions_view(request):
    """Render the submissions.html template"""
    return render(request, '../static/templates/submissions_view.html')

# ✅ Fetch Student Submissions
def get_submissions(request):
    try:
        submissions_ref = db.collection("submissions").stream()
        submissions = [{"id": doc.id, **doc.to_dict()} for doc in submissions_ref]
        return JsonResponse({"submissions": submissions}, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

# ✅ Upload JSON Submission to Firestore
@csrf_exempt
def upload_submission(request):
    if request.method == "POST":
        try:
            file = request.FILES.get("file")
            if not file:
                return JsonResponse({"error": "No file uploaded."}, status=400)

            file_content = file.read().decode("utf-8")
            submission_data = json.loads(file_content)

            # Store in Firestore
            doc_ref = db.collection("submissions").add(submission_data)
            return JsonResponse({"message": "Submission uploaded successfully!", "id": doc_ref[1].id}, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method."}, status=405)