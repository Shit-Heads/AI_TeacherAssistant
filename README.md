# 📚 AI Teacher Assistant

An AI-powered teacher assistant designed to automate assignment grading and provide personalized feedback to students. Built to reduce teacher workload and enhance educational outcomes, especially in large or under-resourced classrooms.

---

## 🚀 Features

- ✍️ **AI-Based Assignment Grading**: Automatically evaluates student submissions.
- 💬 **Personalized Feedback Generation**: Tailored feedback crafted for each student.
- 🔐 **Role-Based Authentication**: Secure login and access control for students and teachers.
- 📤 **Assignment Submission System**: Students can upload their work with ease.
- 📊 **Admin Dashboard**: View submissions, grade status, and feedback reports.
- 🌐 **Firebase Integration**: Secure and scalable backend authentication.
- 🗂️ **Multi-App Architecture**: Includes `assignments`, `submissions`, `authentication`, and `ai_grading` apps for modular development.

---

## 🛠️ Tech Stack

- **Backend**: Django (Python 3.9)
- **Frontend**: Django Templates (HTML, CSS, JS)
- **AI Model**: OpenAI's GPT-based grading
- **Authentication**: Firebase Auth
- **Database**: Google Cloud SQL (MySQL)
- **Deployment**: Google App Engine

---

## 📁 Project Structure

```
ai_teacher_assistant/
│
├── ai_grading/              # AI logic for grading and feedback
├── assignments/             # Assignment creation and distribution
├── submissions/             # Handles student submissions
├── authentication/          # User login/signup with Firebase
├── static/                  # Static files (CSS, JS, media)
├── staticfiles/             # Collected static files (for deployment)
├── templates/               # HTML templates
├── cloud_tokens/            # Firebase credentials
├── manage.py
├── requirements.txt
└── app.yaml                 # GCP App Engine config
```

---

## ⚙️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ai-teacher-assistant.git
cd ai-teacher-assistant
```

### 2. Set Up Virtual Environment
```bash
python -m venv env
source env/bin/activate  # On Windows use: env\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Firebase Setup
Place your Firebase Admin SDK JSON in:
```
cloud_tokens/serviceAccountKey.json
```

### 5. Configure Database
Ensure you have a Google Cloud SQL instance ready. Update the following in `settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': '/cloudsql/YOUR_INSTANCE_CONNECTION_NAME',
        'NAME': 'YOUR_DB_NAME',
        'USER': 'YOUR_USER',
        'PASSWORD': 'YOUR_PASSWORD',
    }
}
```

### 6. Collect Static Files
```bash
python manage.py collectstatic --noinput
```

### 7. Run Server Locally
```bash
python manage.py runserver
```

---

## ☁️ Deployment on Google Cloud Platform

1. Enable App Engine & Cloud SQL API on your project
2. Deploy using:
```bash
gcloud app deploy
```

Make sure `app.yaml` is configured properly for your instance:
```yaml
runtime: python39
entrypoint: gunicorn ai_teacher_assistant.wsgi

beta_settings:
  cloud_sql_instances: YOUR_INSTANCE_CONNECTION_NAME
```

---

## 🎯 Goals Aligned with UN SDG 4

> Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.

By automating routine grading and offering individual feedback, this project enables teachers to focus on mentoring, improving educational quality even in large classrooms.

---

## 🧠 Future Improvements
- Integration with LMS platforms like Google Classroom or Moodle
- Richer feedback with visuals and examples
- Analytics dashboard for student performance tracking

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.



