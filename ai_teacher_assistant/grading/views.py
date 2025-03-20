import requests
from rest_framework import viewsets, permissions
from .models import Assignment, Submission, Feedback
from .serializers import AssignmentSerializer, SubmissionSerializer, FeedbackSerializer
from .permissions import IsTeacher

class AssignmentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsTeacher]
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer

class SubmissionViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Submission.objects.all()
    serializer_class = SubmissionSerializer

    def perform_create(self, serializer):
        submission = serializer.save()
        self.trigger_grading(submission)
    
    def trigger_grading(self, submission):
        # Replace with your actual Gemini API endpoint URL
        gemini_api_url = "https://ai.google.dev/api/rest"
        
        # Build payload according to Gemini API's requirements
        payload = {
            "submission_id": submission.id,
            "content": submission.content,
            # Include additional fields if required by the Gemini API.
        }
        
        # Set up headers for authentication and content type.
        headers = {
            "Authorization": "Bearer AIzaSyAthSl-_Ft0r4wJqHJEYKuPt9MCc-ux-IM",
            "Content-Type": "application/json"
        }
        
        try:
            response = requests.post(gemini_api_url, json=payload, headers=headers)
            if response.status_code == 200:
                result = response.json()
                # Update how you extract the score and feedback based on Gemini's response format.
                Feedback.objects.create(
                    submission=submission,
                    score=result.get("score"),
                    comments=result.get("comments")
                )
            else:
                print(f"Gemini API error: {response.status_code}, {response.text}")
        except Exception as e:
            print(f"Exception calling Gemini API: {e}")

class FeedbackViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer