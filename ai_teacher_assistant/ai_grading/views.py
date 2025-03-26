from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
import firebase_admin
from firebase_admin import credentials, firestore
from google import genai
from google.genai import types

# Initialize Firebase
cred = credentials.Certificate(r"C:\Users\gowth\Projects\recipe_data_django\AI_TeacherAssistant\ai_teacher_assistant\serviceAccountKey.json")  # Update with your file path
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

            # Force AI to return only JSON
            prompt = f"""
            You are an AI grading assistant. Your task is to assess a student's assignment based on the criteria below.

            **Assignment Details:**
            - Student Name: {json_data.get('student_name')}
            - Subject: {json_data.get('subject')}
            - Assignment: {json_data.get('assignment')}
            - Content: {json_data.get('content')}

            **Grading Criteria (Scores out of 5):**
            1. Content Knowledge
            2. Analysis
            3. Organization

            **Expected JSON Output Format:**
            ```
            {{
                "content_knowledge_score": 4,
                "analysis_score": 3,
                "organization_score": 4,
                "suggested_grade": "B (82%)",
                "suggested_feedback": "Anjana, this is a great start. Add more analysis and depth in future assignments."
            }}
            ```
            Respond **ONLY with valid JSON**.
            """

            model = "gemini-2.0-flash-001"
            contents = [prompt]  

            generate_content_config = types.GenerateContentConfig(
                temperature=0.7,
                top_p=0.95,
                max_output_tokens=1024,
                response_modalities=["TEXT"],
            )

            response_text = ""
            for chunk in client.models.generate_content_stream(
                    model=model,
                    contents=contents,
                    config=generate_content_config
            ):
                response_text += chunk.text

            # Debugging: Log the AI response
            print("AI Response Before Cleaning:", response_text)

            # Ensure response is JSON-friendly
            response_text = response_text.strip("```json").strip("```").strip()

            try:
                ai_response = json.loads(response_text)

                # Add student details before saving to Firebase
                ai_response['student_name'] = json_data.get('student_name', 'Unknown')
                ai_response['subject'] = json_data.get('subject', 'Unknown')
                ai_response['assignment'] = json_data.get('assignment', 'Unknown')

                # Store in Firebase Firestore
                doc_ref = db.collection("ai_assessments").add(ai_response)
                ai_response['id'] = doc_ref[1].id  # Firestore document ID

                return JsonResponse(ai_response)  # Return JSON response
            except json.JSONDecodeError:
                return JsonResponse({'error': 'AI response could not be parsed as JSON.', 'raw_response': response_text})

        except Exception as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'})
