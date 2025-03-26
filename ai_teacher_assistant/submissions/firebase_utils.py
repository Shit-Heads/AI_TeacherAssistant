import firebase_admin
from firebase_admin import credentials, firestore
from django.conf import settings
import os
from datetime import datetime

FIREBASE_TOKEN_PATH = r"D:\Programming Projects\AI_TeacherAssistant\ai_teacher_assistant\bingusfirebase.json"

# Initialize Firebase only once
try:
    firebase_admin.get_app()
except ValueError:
    cred = credentials.Certificate(os.path.join(settings.BASE_DIR, FIREBASE_TOKEN_PATH)) #'firebase_credentials.json'
    firebase_admin.initialize_app(cred)

class AssignmentManager:
    def __init__(self):
        self.db = firestore.client()
        self.assignments_ref = self.db.collection('assignments')

    def get_assignments(self, grade=None, subject=None):
        """
        Fetch assignments with optional filtering by grade and subject
        
        :param grade: Optional grade level to filter
        :param subject: Optional subject to filter
        :return: List of assignment dictionaries
        """
        try:
            # Start with base query
            query = self.assignments_ref

            # Apply filters if provided
            if grade:
                query = query.where('grade', '==', str(grade))
            if subject:
                query = query.where('subject', '==', subject)

            # Fetch and process assignments
            assignments = query.stream()
            
            processed_assignments = []
            for assignment in assignments:
                # Convert document to dictionary and add document ID
                assignment_dict = assignment.to_dict()
                assignment_dict['id'] = assignment.id
                
                # Parse and format due date
                if 'due_date' in assignment_dict:
                    try:
                        due_date = datetime.strptime(assignment_dict['due_date'], '%Y-%m-%d')
                        assignment_dict['formatted_due_date'] = due_date.strftime('%B %d, %Y')
                    except ValueError:
                        assignment_dict['formatted_due_date'] = assignment_dict['due_date']
                
                processed_assignments.append(assignment_dict)
            
            return processed_assignments
        except Exception as e:
            print(f"Error fetching assignments: {e}")
            return []

    def get_pending_assignments(self, grade=None, subject=None):
        """
        Fetch pending assignments
        
        :param grade: Optional grade level to filter
        :param subject: Optional subject to filter
        :return: List of pending assignment dictionaries
        """
        try:
            # Get all assignments
            assignments = self.get_assignments(grade, subject)
            
            # Filter for assignments not yet due
            now = datetime.now()
            pending_assignments = [
                assignment for assignment in assignments
                if datetime.strptime(assignment['due_date'], '%Y-%m-%d') > now
            ]
            
            return pending_assignments
        except Exception as e:
            print(f"Error fetching pending assignments: {e}")
            return []

    def get_assignment_by_id(self, assignment_id):
        """
        Fetch a specific assignment by its ID
        
        :param assignment_id: ID of the assignment
        :return: Assignment dictionary or None
        """
        try:
            assignment_doc = self.assignments_ref.document(assignment_id).get()
            if assignment_doc.exists:
                assignment_data = assignment_doc.to_dict()
                assignment_data['id'] = assignment_id
                return assignment_data
            return None
        except Exception as e:
            print(f"Error fetching assignment: {e}")
            return None