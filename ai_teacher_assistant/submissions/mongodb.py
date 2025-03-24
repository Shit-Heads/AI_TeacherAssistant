from pymongo import MongoClient

def get_mongo_client():
    client = MongoClient('mongodb://localhost:27017/')
    return client

def save_to_mongodb(name, class_name, questions_answers, sub):
    print("called save function")
    client = get_mongo_client()
    db = client['AI_assistant']
    collection = db['Submissions']

    for qa in questions_answers:
        submission_data = {
            'student_name': name,
            'subject': sub,
            'class': class_name,
            'assignment': qa['question'],
            'content': qa['answer']
        }
        collection.insert_one(submission_data)
        print("inserted")

    client.close()