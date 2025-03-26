from django.shortcuts import render, redirect
from django.http import HttpResponse
from .mongodb import save_to_mongodb
from docx import Document
import re
from django.contrib.auth.decorators import login_required
from .firebase_utils import AssignmentManager

def submissions(request):
    print("submissions")
    if request.method == 'POST' and request.FILES['file']:
        uploaded_file = request.FILES['file']
        
        # Check if the uploaded file is a .docx file
        if not uploaded_file.name.endswith('.docx'):
            return HttpResponse('Invalid file type. Please upload a .docx file.', status=400)
        
        # Read the .docx file
        try:
            document = Document(uploaded_file)
            file_content = "\n".join([para.text for para in document.paragraphs])
        except Exception as e:
            print(f"Error reading .docx file: {e}")
            return HttpResponse('Failed to read .docx file', status=400)
        
        print(f"File content: {file_content[:100]}...")  # Log the first 100 characters of the file content
        
        # Parse the content
        try:
            name_match = re.search(r'Name:\s*(.*)', file_content)
            class_match = re.search(r'Class:\s*(.*)', file_content)
            sub_match = re.search(r'Subject:\s*(.*)', file_content)
            qa_matches = re.findall(r'Question:\s*(.*?)\s*Answer:\s*(.*?)(?=\s*Question:|\s*$)', file_content, re.DOTALL)
            
            if not name_match or not class_match or not qa_matches:
                return HttpResponse('Invalid content format in .docx file', status=400)
            
            name = name_match.group(1).strip()
            class_name = class_match.group(1).strip()
            sub = sub_match.group(1).strip()
            questions_answers = []
            for question, answer in qa_matches:
                questions_answers.append({
                    'question': question.strip(),
                    'answer': answer.strip()
                })
            
            print("data extracted")
        except Exception as e:
            print(f"Error parsing content: {e}")
            return HttpResponse('Failed to parse content in .docx file', status=400)
        
        # Save to MongoDB
        save_to_mongodb(name, class_name, questions_answers,sub)
        
        return HttpResponse('File uploaded successfully')
    return render(request, '../static/templates/submissions.html')

def pending_submissions(request):
    return render(request, '../static/templates/submissions/submission.html')

def submissions_home(request):
    return render(request, '../static/templates/submissions/submission_portal.html')

@login_required
def submissions_home(request):
    assignment_manager = AssignmentManager()
    
    try:
        # Fetch assignments (you can add filters if needed)
        recent_assignments = assignment_manager.get_assignments()
        pending_assignments = assignment_manager.get_pending_assignments()
        
        context = {
            'recent_assignments': recent_assignments,
            'pending_assignments': pending_assignments,
            'total_assignments': len(recent_assignments),
            'total_pending': len(pending_assignments)
        }
        
        return render(request, '../static/templates/submissions/submission_portal.html', context)
    
    except Exception as e:
        print(f"Error in submissions home view: {e}")
        return render(request, '../static/templates/submissions/submission_portal.html', {
            'recent_assignments': [],
            'pending_assignments': [],
            'total_assignments': 0,
            'total_pending': 0,
            'error': 'Unable to fetch assignments'
        })

@login_required
def pending_submissions(request):
    assignment_manager = AssignmentManager()
    
    try:
        # You can add optional filtering by grade or subject
        pending_assignments = assignment_manager.get_pending_assignments()
        
        context = {
            'pending_assignments': pending_assignments,
            'total_pending': len(pending_assignments)
        }
        
        return render(request, '../static/templates/submissions/submission_pending.html', context)
    
    except Exception as e:
        print(f"Error in pending submissions view: {e}")
        return render(request, '../static/templates/submissions/submission_pending.html', {
            'pending_assignments': [],
            'total_pending': 0,
            'error': 'Unable to fetch pending assignments'
        })