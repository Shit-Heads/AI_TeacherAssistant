from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from google import genai
from google.genai import types
import os

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

            prompt = f"""
            The following is a student's assignment submission. Grade the assignment based on the criteria below and provide a detailed analysis.

            Criteria:
            1. Make the overall grading system short and simple to understand.

            Assignment Details:
            Student Name: {json_data.get('student_name')}
            Subject: {json_data.get('subject')}
            Assignment: {json_data.get('assignment')}
            Content: {json_data.get('content')}

            Please provide:
            - Content Knowledge Score (out of 5)
            - Analysis Score (out of 5)
            - Organization Score (out of 5)
            - Suggested Grade (e.g., B+ (88%))
            - Suggested Feedback Make it smaller
            """

            model = "gemini-2.0-flash-001"
            contents = [prompt]  

            generate_content_config = types.GenerateContentConfig(
                temperature=0.7,
                top_p=0.95,
                max_output_tokens=1024,
                response_modalities=["TEXT"],
                safety_settings=[
                    types.SafetySetting(category="HARM_CATEGORY_HATE_SPEECH", threshold="OFF"),
                    types.SafetySetting(category="HARM_CATEGORY_DANGEROUS_CONTENT", threshold="OFF"),
                    types.SafetySetting(category="HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold="OFF"),
                    types.SafetySetting(category="HARM_CATEGORY_HARASSMENT", threshold="OFF")
                ]
            )

            response_text = ""
            for chunk in client.models.generate_content_stream(
                    model=model,
                    contents=contents,
                    config=generate_content_config
            ):
                response_text += chunk.text

            return JsonResponse({'response': response_text})

        except Exception as e:
            return JsonResponse({'error': str(e)})

    return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'})
