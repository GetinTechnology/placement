# Generated by Django 5.1.6 on 2025-02-24 10:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('test_portal', '0006_remove_answer_additional_data_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='test',
        ),
        migrations.DeleteModel(
            name='Answer',
        ),
        migrations.DeleteModel(
            name='Question',
        ),
    ]
