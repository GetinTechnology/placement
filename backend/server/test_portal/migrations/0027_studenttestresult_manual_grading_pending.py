# Generated by Django 5.1.6 on 2025-03-26 06:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_portal', '0026_studentresponse_marks_awarded_alter_answer_text'),
    ]

    operations = [
        migrations.AddField(
            model_name='studenttestresult',
            name='manual_grading_pending',
            field=models.BooleanField(default=False),
        ),
    ]
