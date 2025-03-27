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
        self.submissions_ref = self.db.collection('submissions')

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

    def get_pending_assignments(self, grade=None, subject=None, username=None):
        """
        Fetch pending assignments
        
        :param grade: Optional grade level to filter
        :param subject: Optional subject to filter
        :param username: Optional username to check submission status
        :return: List of pending assignment dictionaries
        """
        try:
            # Get all assignments
            assignments = self.get_assignments(grade, subject)
            
            # Get current time
            now = datetime.now()
            
            # Filter for assignments not yet due
            pending_assignments = [
                assignment for assignment in assignments
                if(datetime.strptime(assignment['due_date'], '%Y-%m-%d') > now) and (not username or (assignment.get('submitted_users') is None) or (username not in assignment.get('submitted_users', [])))
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
        
    def save_submission(self, name, class_name, questions_answers, subject, assignment_id, username):
        """
        Save submission to Firebase
        
        :param name: Student name
        :param class_name: Student's class
        :param questions_answers: List of question-answer dictionaries
        :param subject: Subject of the submission
        :param assignment_id: ID of the assignment
        :param username: Username of the student
        :return: True if successful, False otherwise
        """
        try:
            assignment = self.get_assignment_by_id(assignment_id)
            
            # Iterate through questions and answers and save each as a separate document
            for qa in questions_answers:
                submission_data = {
                    'assignment_id': assignment_id,
                    'student_name': name,
                    'subject': subject,
                    'class': class_name,
                    'assignment': qa['question'],
                    'content': qa['answer'],
                    'timestamp': firestore.SERVER_TIMESTAMP,
                    'status': 'submitted',
                    'submitted_by': username
                }
                
                # Add document to submissions collection
                self.submissions_ref.add(submission_data)

            # Update assignment to track submitted users
            assignment_doc = self.assignments_ref.document(assignment_id)
            assignment_doc.update({
                'submitted_users': firestore.ArrayUnion([username]),
            })
            
            return True
        except Exception as e:
            print(f"Error saving submission to Firebase: {e}")
            return False


    def save_submission_custom(self, username, assignment_id, questions_answers):
        """
        Save submission to Firebase
        
        :param username: Student username
        :param assignment_id: ID of the assignment being submitted
        :param questions_answers: List of question-answer dictionaries
        :return: True if successful, False otherwise
        """
        try:
            # Fetch assignment details to get additional context
            assignment = self.get_assignment_by_id(assignment_id)
            
            if not assignment:
                print(f"Assignment with ID {assignment_id} not found")
                return False

            # Prepare submission data
            submission_data = {
                'name': username,
                'assignment_id': assignment_id,
                'subject': assignment.get('subject', 'Unknown'),
                'grade': assignment.get('grade', 'Unknown'),
                'answers': questions_answers,
                'timestamp': firestore.SERVER_TIMESTAMP,
                'status': 'submitted'
            }
            
            # Add document to submissions collection
            self.submissions_ref.add(submission_data)
            
            # Mark assignment as submitted
            assignment_doc = self.assignments_ref.document(assignment_id)
            assignment_doc.update({
                'status': 'submitted',
                'submitted_at': firestore.SERVER_TIMESTAMP,
                'submitted_by': username
            })
            
            return True
        except Exception as e:
            print(f"Error saving submission to Firebase: {e}")
            return False
        
    def get_submitted_assignments(self, grade=None, subject=None):
        """
        Fetch submitted assignments

        :param grade: Optional grade level to filter
        :param subject: Optional subject to filter
        :return: List of submitted assignment dictionaries
        """
        try:
            # Start with base query
            query = self.assignments_ref

            # Apply filters if provided
            if grade:
                query = query.where('grade', '==', str(grade))
            if subject:
                query = query.where('subject', '==', subject)

            # Filter for assignments with submitted users
            query = query.where('submitted_users', '!=', [])

            # Fetch assignments
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
            print(f"Error fetching submitted assignments: {e}")
            return []

    def get_submission_details(self, assignment_id):
        """
        Fetch detailed submissions for a specific assignment
        
        :param assignment_id: ID of the assignment
        :return: List of submission dictionaries
        """
        try:
            # Query submissions for this specific assignment
            query = self.submissions_ref.where('assignment_id', '==', assignment_id)
            submissions = query.stream()
            
            processed_submissions = []
            for submission in submissions:
                # Convert document to dictionary
                submission_dict = submission.to_dict()
                processed_submissions.append(submission_dict)
            
            return processed_submissions
        except Exception as e:
            print(f"Error fetching submission details: {e}")
            return []