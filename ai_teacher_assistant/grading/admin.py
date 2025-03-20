from django.contrib import admin
from .models import Assignment, Submission, Feedback

admin.site.register(Assignment)
admin.site.register(Submission)
admin.site.register(Feedback)