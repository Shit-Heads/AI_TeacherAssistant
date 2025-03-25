# Generated by Django 3.1.12 on 2025-03-25 03:31

from django.db import migrations, models
import djongo.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('_id', djongo.models.fields.ObjectIdField(auto_created=True, primary_key=True, serialize=False)),
                ('user_id', models.CharField(max_length=150, unique=True)),
                ('username', models.CharField(max_length=150)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('role', models.CharField(choices=[('student', 'Student'), ('teacher', 'Teacher'), ('admin', 'Administrator')], default='student', max_length=20)),
            ],
            options={
                'db_table': 'user_profiles',
            },
        ),
    ]
