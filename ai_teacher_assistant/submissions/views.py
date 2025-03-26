from django.shortcuts import render, redirect
from django.http import HttpResponse
from .mongodb import save_to_mongodb
from docx import Document
import re

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