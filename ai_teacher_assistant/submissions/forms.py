from django import forms

class AssignmentSubmissionForm(forms.Form):
    assignment_id = forms.CharField(max_length=100, required=True)
    submission_type = forms.ChoiceField(choices=[
        ('file', 'File Upload'),
        ('text', 'Text Submission')
    ])
    file = forms.FileField(required=False)
    text_submission = forms.CharField(widget=forms.Textarea, required=False)