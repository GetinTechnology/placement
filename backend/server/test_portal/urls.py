from django.urls import path
from . import views

urlpatterns = [
    path('test/', views.test, name='test'),
    path('updatetest/<int:test_id>', views.test, name='update'),
    path('delete/<int:test_id>',views.delete_test,name='delete'),
    path('category/',views.add_category,name='category'),
    path('modeify_category/<int:category_id>',views.category_update_delete,name='modeify _category'),
    path("test/<int:test_id>/questions/add", views.add_question, name="add_question"),
    path("test/<int:test_id>/questions", views.get_questions, name="get_questions"),
    path("question/<int:question_id>/answers/add", views.add_answer, name="add_answer"),
    path("question/<int:question_id>/answers", views.get_answers, name="get_answers"),
    path("test/<int:test_id>/upload_csv/",views.upload_csv,name="upload_csv"),
    path('test/<int:test_id>/question/<int:question_id>/delete/', views.delete_question, name='delete-question'),
    path('test/<int:test_id>/details/',views.get_test_details,name='test_deatils'),
    path('test/<int:test_id>/submit/',views.submit_test,name='submit_test'),
    path('test/<int:test_id>/result',views.get_student_result,name='result'),
    path('test/<int:test_id>/generate_link/',views.generate_test_link,name='generate_link'),
    path('test/<int:test_id>/submission_status/',views.check_submission_status,name='submission_status'),
    path('test/<int:test_id>/activate/', views.activate_test, name='activate-test'),
    path('test/<int:test_id>/deactivate/', views.deactivate_test, name='deactivate-test'),
    path('test/<int:test_id>/status/', views.get_test_status, name='test-status'),
    path('test/<int:test_id>/test-set/', views.create_test_set, name='create-test-set'),
    path('test/<int:test_id>/all_results',views.get_all_students_results,name='get_all_students_results'),
    path('test/test_result',views.get_test_results,name='get_test_results'),
    path("test/<int:test_id>/descriptive/", views.manage_descriptive_responses, name="manage_descriptive_responses"),

     
]