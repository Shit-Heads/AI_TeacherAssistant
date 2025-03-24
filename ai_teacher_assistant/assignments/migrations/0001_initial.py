# Generated by Django 5.1.5 on 2025-03-24 04:04

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Assignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sub_name', models.CharField(max_length=100)),
                ('question', models.FileField(upload_to='../assets/assignments/')),
                ('upload_time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
    ]
