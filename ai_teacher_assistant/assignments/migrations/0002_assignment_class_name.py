# Generated by Django 5.1.5 on 2025-03-24 04:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assignments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='class_name',
            field=models.CharField(max_length=100, null=True),
        ),
    ]
