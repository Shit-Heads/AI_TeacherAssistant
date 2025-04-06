# Use official Python image
FROM python:3.11

# Set environment variables
ENV PYTHONUNBUFFERED 1
ENV PORT 8080

# Set work directory
WORKDIR /app

# Copy project files
COPY . /app

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Collect static files
RUN python manage.py collectstatic --noinput

# Start the app
CMD ["gunicorn", "-b", "0.0.0.0:8080", "ai_teacher_assistant.wsgi:application"]
