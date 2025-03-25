from django.shortcuts import render

# Create your views here.
def assignments_view(request):
    return render(request, '../static/templates/assignments.html')
