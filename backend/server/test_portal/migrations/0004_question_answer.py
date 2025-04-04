# Generated by Django 5.1.6 on 2025-02-24 04:10

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('test_portal', '0003_test_created_by'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField()),
                ('answer_type', models.CharField(choices=[('single', 'Single Choice'), ('multiple', 'Multiple Choice'), ('descriptive', 'Descriptive'), ('true_false', 'True/False'), ('short_answer', 'Short Answer'), ('survey', 'Survey')], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='test_portal.test')),
            ],
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.CharField(max_length=500)),
                ('is_correct', models.BooleanField(default=False)),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='answers', to='test_portal.question')),
            ],
        ),
    ]
