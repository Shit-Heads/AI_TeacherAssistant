from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from .models import Assignment, Submission, Feedback
from .serializers import AssignmentSerializer, SubmissionSerializer, FeedbackSerializer
from .permissions import IsTeacher
from .tasks import process_grading
#import requests  # This will be used later to integrate with Google Cloud Vertex AI

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
        process_grading(submission.id)
        #self.trigger_grading(submission)
    
    def trigger_grading(self, submission):
        # Simulated grading response for testing
        result = {
            "score": 85.0,
            "comments": "Good job! Your analysis is well-organized and insightful."
        }
        Feedback.objects.create(
            submission=submission,
            score=result.get("score"),
            comments=result.get("comments")
        )
        # When integrating with Vertex AI, uncomment and update the code below:
        """
        vertex_ai_url = "https://your-vertex-ai-endpoint"  # Update with your actual current endpoint
        payload = {
            "submission_id": submission.id,
            "content": submission.content,
        }
        try:
            response = requests.post(vertex_ai_url, json=payload)
            if response.status_code == 200:
                result = response.json()
                Feedback.objects.create(
                    submission=submission,
                    score=result.get("score"),
                    comments=result.get("comments")
                )
        except Exception as e:
            print(f"Error during grading: {e}")
        """

class FeedbackViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Feedback.objects.all()
    serializer_class = FeedbackSerializer