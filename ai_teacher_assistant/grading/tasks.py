from celery import shared_task
from .models import Submission, Feedback

@shared_task
def process_grading(submission_id):
    # Retrieve the submission object. If not found, simply exit.
    try:
        submission = Submission.objects.get(id=submission_id)
    except Submission.DoesNotExist:
        return None

    # Simulate grading with a dummy response.
    result = {
        "score": 85.0,
        "comments": "Good job! Your analysis is well-organized and insightful."
    }

    # Create feedback for this submission based on simulated grading.
    Feedback.objects.create(
        submission=submission,
        score=result.get('score'),
        comments=result.get('comments')
    )

    return result