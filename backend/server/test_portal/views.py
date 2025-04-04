from rest_framework.decorators import api_view, permission_classes,authentication_classes,parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Test
from .serializers import *
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Category
from .serializers import CategorySerializer
import pandas as pd
from django.db import transaction
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import AllowAny
from django.core.exceptions import ValidationError
import logging
from django.db.models import Sum

logger = logging.getLogger(__name__)



@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_category(request):
    if request.method == 'GET':  #Fetch all categories
        categories = Category.objects.filter(created_by=request.user)
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':  # Add new category
        category_name = request.data.get('name', '').strip()

        if not category_name:
            return Response({'error': 'Category name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if Category.objects.filter(name__iexact=category_name, created_by=request.user).exists():
            return Response({'error': 'You already created this category.'}, status=status.HTTP_400_BAD_REQUEST)

        category = Category.objects.create(name=category_name, created_by=request.user)  # Assign user
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['PUT', 'DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def category_update_delete(request, category_id):
    category = get_object_or_404(Category, id=category_id)

    #Only allow the creator to update/delete (except admin)
    if category.created_by != request.user and not request.user.is_superuser:
        return Response({'error': 'You do not have permission to modify this category.'}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'PUT':  #Update category
        new_name = request.data.get('name', '').strip()

        if not new_name:
            return Response({'error': 'Category name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if Category.objects.filter(name__iexact=new_name).exclude(id=category_id).exists():
            return Response({'error': 'Category with this name already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        category.name = new_name
        category.save()
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':  #Delete category
        category.delete()
        return Response({'message': 'Category deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET', 'POST', 'PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def test(request, test_id=None):
    if not request.user.is_verified:
        return Response({"error": "You must verify your email before accessing this feature."},
                        status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        tests = Test.objects.filter(created_by=request.user)
        serializer = TestSerializer(tests, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        print("Received Data:", request.data)  # Debugging

        category_id = request.data.get('category', None)

        if not category_id:
            return Response({'error': 'Category is required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            category_id = int(category_id)  # Ensure it's an integer
        except ValueError:
            return Response({'error': 'Invalid category format.'}, status=status.HTTP_400_BAD_REQUEST)

        category = Category.objects.filter(id=category_id).first()
        if not category:
            return Response({'error': 'Invalid category selection.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TestSerializer(data=request.data, context={'request': request})
    
        print("Serializer Initial Data:", serializer.initial_data)  # Debugging

        if serializer.is_valid():
            serializer.save(category=category)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        print("Serializer Errors:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        try:
            test = Test.objects.get(id=test_id, created_by=request.user)
        except Test.DoesNotExist:
            return Response({"error": "Test not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TestSerializer(test, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 


@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def activate_test(request, test_id):
    try:
        test = Test.objects.get(id=test_id, created_by=request.user)
    except Test.DoesNotExist:
        return Response({"error": "Test not found"}, status=status.HTTP_404_NOT_FOUND)

    test_active, created = TestActive.objects.get_or_create(test=test)

    test_active.is_active = True
    test_active.activated_at = now()
    test_active.expires_at = now() + timedelta(hours=1)  # Auto-expire after 1 hour
    test_active.save()

    serializer = TestActiveSerializer(test_active)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def deactivate_test(request, test_id):
    try:
        test_active = TestActive.objects.get(test__id=test_id)
    except TestActive.DoesNotExist:
        return Response({"error": "Test not active"}, status=status.HTTP_404_NOT_FOUND)

    test_active.delete()
    return Response({"message": "Test deactivated"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_test_status(request, test_id):
    try:
        test_active = TestActive.objects.get(test__id=test_id)
        serializer = TestActiveSerializer(test_active)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except TestActive.DoesNotExist:
        return Response({"test":test_id,"is_active": False}, status=status.HTTP_200_OK)



@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_test(request, test_id):
    try:
        test = Test.objects.get(id=test_id)
        
        # Optional: Ensure only the creator can delete the test
        if test.created_by != request.user:
            return Response({"error": "You do not have permission to delete this test."},
                            status=status.HTTP_403_FORBIDDEN)

        test.delete()
        return Response({"message": "Test deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
    
    except Test.DoesNotExist:
        return Response({"error": "Test not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])  
def duplicate_test(request, test_id):
    try:
        # Get the original test object
        original_test = Test.objects.get(id=test_id)
        
        # Create a new test instance by copying the original
        duplicated_test = Test.objects.create(
            test_name = f"{original_test.test_name} (Copy)",
            category = original_test.category,
            description = original_test.description,
            created_by = original_test.created_by,  # Keep the same creator
            # Copy any other fields as needed
        )

        serializer = TestSerializer(duplicated_test)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    except Test.DoesNotExist:
        return Response({"error": "Test not found."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_question(request, test_id):
    print("Incoming request data:", request.data)  # Debugging log

    try:
        test = Test.objects.get(id=test_id, created_by=request.user)
    except Test.DoesNotExist:
        return Response({"error": "Test not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = QuestionSerializer(data=request.data, context={'request': request, 'test': test})  
    print("Is valid:", serializer.is_valid())  
    print("Errors:", serializer.errors)

    if serializer.is_valid():
        serializer.save(test=test)  
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_questions(request, test_id):
    questions = Question.objects.filter(test__id=test_id, test__created_by=request.user)
    serializer = QuestionSerializer(questions, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_answer(request, question_id):
    try:
        question = Question.objects.get(id=question_id, test__created_by=request.user)
    except Question.DoesNotExist:
        return Response({"error": "Question not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = AnswerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(question=question)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_answers(request, question_id):
    answers = Answer.objects.filter(question__id=question_id, question__test__created_by=request.user)
    serializer = AnswerSerializer(answers, many=True)
    return Response(serializer.data)

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])  # Ensures only logged-in users can delete
def delete_question(request, test_id, question_id):
    question = get_object_or_404(Question, id=question_id, test_id=test_id)

    # Optional: Check if the user has permission to delete (modify as per your logic)
    if request.user != question.created_by:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    question.delete()
    return Response({"message": "Question deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_question(request, test_id, question_id):
    question = get_object_or_404(Question, id=question_id, test_id=test_id)


    if request.user != question.created_by:
        return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)

    serializer = QuestionSerializer(instance=question, data=request.data, partial=True)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([IsAuthenticated])  # Ensure user authentication
@parser_classes([MultiPartParser, FormParser])
def upload_csv(request, test_id):
    """
    Upload a CSV file to bulk add questions.
    CSV Format: question_text, question_type, points, answer1, correct1, answer2, correct2, ...
    """
    user = request.user  # Get the authenticated user
    file = request.FILES.get('file')

    if not file:
        return Response({"error": "No file uploaded."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        df = pd.read_csv(file)
    except Exception as e:
        logger.error(f"CSV parsing error: {str(e)}")
        return Response({"error": f"Invalid CSV file: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    # Required Columns Validation
    required_columns = {'question_text', 'question_type', 'points', 'answer1', 'correct1'}
    if not required_columns.issubset(df.columns):
        return Response({"error": "CSV file missing required columns."}, status=status.HTTP_400_BAD_REQUEST)

    created_questions = []
    
    try:
        with transaction.atomic():  # Ensure atomicity

            for _, row in df.iterrows():
                question_text = row.get('question_text')
                question_type = row.get('question_type')
                points = row.get('points')

                # Basic Validation
                if pd.isna(question_text) or pd.isna(question_type) or pd.isna(points):
                    continue  # Skip invalid rows

                # Save question individually
                question = Question.objects.create(
                    test_id=test_id,
                    text=question_text,
                    question_type=question_type,
                    points=int(points),
                    created_by=user  # Ensure user is assigned
                )

                # Process answers (Now we have a saved question instance)
                answers_to_create = []
                for i in range(1, 6):  # Assuming max 5 answers per question
                    answer_text = row.get(f'answer{i}')
                    is_correct = row.get(f'correct{i}', False)

                    if pd.notna(answer_text):
                        answers_to_create.append(Answer(
                            question=question,
                            text=answer_text,
                            is_correct=bool(is_correct)
                        ))

                # Bulk insert answers for the current question
                if answers_to_create:
                    Answer.objects.bulk_create(answers_to_create)

                created_questions.append(question.id)

        return Response(
            {"message": "Questions added successfully", "question_ids": created_questions},
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        logger.error(f"Error while inserting questions: {str(e)}")
        return Response({"error": f"Something went wrong: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_test_details(request, test_id):
    """
    Fetch test details including test name, description, questions with answer choices, and test set details.
    """
    try:
        test = get_object_or_404(Test, id=test_id)
        
        # Fetch related test set
        test_set_data = None
        if hasattr(test, 'test_set'):
            test_set = test.test_set
            test_set_data = {
                "id": test_set.id,
                "order_type": test_set.order_type,
                "questions_per_page": test_set.questions_per_page,
            }

        # Fetch questions and their corresponding answers
        questions = test.questions.all()  # Use related_name if set
        question_list = []
        
        for question in questions:
            answers = question.answers.all()  # Use related_name if set
            answer_list = [
                {
                    "id": answer.id,
                    "text": answer.text,
                    "is_correct": answer.is_correct  # Include this only if necessary
                }
                for answer in answers
            ]
            
            question_list.append({
                "id": question.id,
                "text": question.text,
                "question_type": question.question_type,
                "points": question.points,
                "answers": answer_list
            })

        # Prepare the final response
        response_data = {
            "test_id": test.id,
            "test_name": test.name,
            "description": test.description,
            "category": test.category.name if test.category else None,
            "questions": question_list,
            "test_set": test_set_data  # Included test set details
        }

        return Response(response_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def generate_test_link(request, test_id):
    user = request.user

    return Response({"test_link": f"http://localhost:3000/test/{test_id}/"}, status=200)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def submit_test(request, test_id):
    """
    Submits the test, calculates the score for auto-graded questions,
    and stores descriptive answers for manual evaluation.
    """
    try:
        student = request.user
        test = get_object_or_404(Test, id=test_id)

        # Ensure test attempt exists or create one
        attempt, created = TestAttempt.objects.get_or_create(
            test=test, student=student, defaults={"submitted": False}
        )

        print(f"Attempt Found: {attempt}, Created: {created}")

        # Get submitted answers from request
        submitted_answers = request.data.get("responses", [])  # Expecting a list of answer dictionaries

        auto_score = 0
        total_marks = 0

        for answer in submitted_answers:
            question_id = answer.get("question_id")
            selected_choice_ids = answer.get("selected_choices", [])  # List of choice IDs
            descriptive_answer = answer.get("descriptive_answer", "").strip()  # Descriptive answer

            question = get_object_or_404(Question, id=question_id)

            # Retrieve correct answer(s) for auto-graded questions
            correct_answer_ids = set(
                Answer.objects.filter(question=question, is_correct=True).values_list("id", flat=True)
            )

            # Create a response object
            response, created = StudentResponse.objects.get_or_create(
                attempt=attempt, question=question
            )

            if question.question_type in ["single_choice", "true_false"]:
                # Store the selected choice
                response.selected_choices.set(selected_choice_ids)

                # Validate if the selected choice matches the correct answer
                if set(selected_choice_ids) == correct_answer_ids:
                    auto_score += question.points  # Add points if correct

                total_marks += question.points

            elif question.question_type == "multiple_choice":
                # Store selected choices
                response.selected_choices.set(selected_choice_ids)

                # Score based on correct selection (Full points only if all correct answers are selected)
                if set(selected_choice_ids) == correct_answer_ids:
                    auto_score += question.points  

                total_marks += question.points

            elif question.question_type in ["descriptive", "short_answer", "survey"]:
                # Store descriptive response for manual grading
                response.descriptive_answer = descriptive_answer
                response.marks_awarded = None  # Needs manual grading
                response.save()

                total_marks += question.points  # Marks will be awarded after review
                
        # Save result with only auto-graded questions (Descriptive excluded)
        total_marks = max(total_marks, 1)  # Avoid division by zero
        result, created = StudentTestResult.objects.update_or_create(
            attempt=attempt,
            defaults={
                "score": auto_score,  # Only auto-scored questions counted
                "total_marks": total_marks,  
                "percentage": (auto_score / total_marks) * 100,  
                "manual_grading_pending": True,  # Flag to indicate manual grading needed
            },
        )

        attempt.submitted = True
        attempt.save()

        return Response(
            {
                "message": "Test submitted successfully! Descriptive answers need manual grading.",
                "auto_score": result.score,  # Shows only auto-graded score
                "total_marks": result.total_marks,
                "percentage": result.percentage,
                "manual_grading_pending": True,  # Notify frontend that manual grading is needed
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        print(f"Error: {str(e)}")  # Debugging Line
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





@api_view(["GET"])
@permission_classes([IsAuthenticated])
def check_submission_status(request, test_id):
    """
    Check if a student has submitted a test.
    """
    user = request.user
    attempt = TestAttempt.objects.filter(student=user, test_id=test_id).first()
    
    return Response({"submitted": attempt.submitted if attempt else False}, status=200)







@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_test_set(request, test_id):
    """Creates or updates a test set with order type & pagination setting."""
    try:
        test = Test.objects.get(id=test_id, created_by=request.user)
    except Test.DoesNotExist:
        return Response({"error": "Test not found"}, status=status.HTTP_404_NOT_FOUND)

    order_type = request.data.get("order_type", "fixed")
    questions_per_page = int(request.data.get("questions_per_page", 5))

    test_set, created = TestSet.objects.get_or_create(test=test, defaults={'order_type': order_type, 'questions_per_page': questions_per_page})
    if not created:
        test_set.order_type = order_type
        test_set.questions_per_page = questions_per_page
        test_set.save()

    serializer = TestSetSerializer(test_set)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_all_students_results(request, test_id):
    """
    Fetches test results for all students who attempted the given test.
    """
    try:
        # Get all test attempts for the given test ID
        attempts = TestAttempt.objects.filter(test_id=test_id, submitted=True).select_related("student")

        if not attempts.exists():
            return Response(
                {"message": "No test results found for this test."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Gather results for each student
        all_results = []
        for attempt in attempts:
            if not hasattr(attempt, "result"):
                continue  # Skip attempts without results

            result = attempt.result
            responses = StudentResponse.objects.filter(attempt=attempt)

            answer_details = [
                {
                    "question_id": response.question.id,
                    "question_text": response.question.text,
                    "student_answer": list(
                        response.selected_choices.values_list("text", flat=True)
                    ),
                    "correct_answer": list(
                        Answer.objects.filter(
                            question=response.question, is_correct=True
                        ).values_list("text", flat=True)
                    ),
                    "is_correct": set(
                        response.selected_choices.values_list("id", flat=True)
                    )
                    == set(
                        Answer.objects.filter(
                            question=response.question, is_correct=True
                        ).values_list("id", flat=True)
                    ),
                }
                for response in responses
            ]

            all_results.append({
                "student_name": attempt.student.get_full_name() or attempt.student.username,
                "student_email": attempt.student.email,
                "test_name": attempt.test.name,
                "score": result.score,
                "total_marks": result.total_marks,
                "percentage": result.percentage,
                "submitted_at": result.submitted_at,
                "answers": answer_details,
            })

        return Response({"results": all_results}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    

@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_test_results(request):
    """
    Fetch all students' test results across all tests.
    """
    try:
        results = StudentTestResult.objects.select_related("attempt__student", "attempt__test")

        results_data = [
            {
                "student_name": result.attempt.student.username,
                "student_email": result.attempt.student.email,
                "test_name": result.attempt.test.name,
                "score": result.score,
                "total_marks": result.total_marks,
                "percentage": result.percentage,
                "submitted_at": result.submitted_at,
                "manual_grading_pending":result.manual_grading_pending
            }
            for result in results
        ]

        return Response({"results": results_data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)







@api_view(["GET", "POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def manage_descriptive_responses(request, test_id):
    """
    GET: Retrieve descriptive responses awaiting review.
    POST: Update student results after grading.
    """
    test = get_object_or_404(Test, id=test_id)

    if request.method == "GET":
        # Fetch all descriptive questions
        descriptive_questions = Question.objects.filter(
            test=test, question_type__in=["descriptive", "short_answer", "survey"]
        )

        # Fetch responses related to these questions
        responses = StudentResponse.objects.filter(question__in=descriptive_questions)

        # Check if any response is ungraded
        ungraded_responses = responses.filter(marks_awarded=None).exists()
        
      

        # Serialize data
        data = [
            {
                "response_id": response.id,
                "student": response.attempt.student.email,
                "question": response.question.text,
                "descriptive_answer": response.descriptive_answer,
                "marks_awarded": response.marks_awarded,
                "max_marks": response.question.points,
            }
            for response in responses
        ]

        return Response(
            {
                "status": "waiting for review" if ungraded_responses else "graded",
                "responses": data,
            },
            status=status.HTTP_200_OK,
        )

    elif request.method == "POST":
        """
        ✅ Update the student result score after grading
        
        """
        responses_data = request.data.get("responses", [])

        for response_data in responses_data:
            response_id = response_data.get("response_id")
            marks_awarded = response_data.get("marks_awarded")

            response = get_object_or_404(StudentResponse, id=response_id)
            
            if response.marks_awarded is not None:
                return Response(
                    {"error": f"Marks already awarded for response {response_id}."},
                    status=status.HTTP_400_BAD_REQUEST,
            )

            if marks_awarded > response.question.points:
                return Response(
                    {"error": f"Marks cannot exceed {response.question.points} for question {response.question.text}"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # ✅ Assign marks
            response.marks_awarded = marks_awarded
            response.save()
        test_attempts = TestAttempt.objects.filter(test=test)

        for attempt in test_attempts:
            update_test_score(attempt)  # Recalculate test score for each student

        return Response({"message": "Student results updated successfully!"}, status=status.HTTP_200_OK)


def update_test_score(attempt):
    """
    ✅ Update the student's test score by adding newly graded descriptive answers.
    """
    # Fetch the current student test result
    student_result, created = StudentTestResult.objects.get_or_create(attempt=attempt)

    # Get the existing MCQ score
    existing_score = student_result.score or 0

    # Calculate total descriptive score (newly graded responses)
    descriptive_score = StudentResponse.objects.filter(
        attempt=attempt, 
        question__question_type__in=["descriptive", "short_answer", "survey"]
    ).aggregate(total_score=Sum("marks_awarded"))["total_score"] or 0

    # Update the total score by adding descriptive answers
    student_result.score = existing_score + descriptive_score

    # Recalculate total marks (including all question types)
    total_marks = Question.objects.filter(test=attempt.test).aggregate(
        total_marks=Sum("points")
    )["total_marks"] or 0

    # Recalculate percentage
    student_result.percentage = (student_result.score / total_marks * 100) if total_marks > 0 else 0

    # Save the updated result
    student_result.save()

    print(f"Updated Result: Score={student_result.score}, Percentage={student_result.percentage}")






@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_student_result(request, test_id):
    """
    Fetch the student's test result using test ID.
    If descriptive questions are ungraded, return "waiting for review".
    """
    try:
        attempt = get_object_or_404(TestAttempt, test_id=test_id, student=request.user)

        if not hasattr(attempt, "result"):
            return Response(
                {"message": "Test result not found"}, status=status.HTTP_404_NOT_FOUND
            )

        result = attempt.result
        responses = StudentResponse.objects.filter(attempt=attempt)

        # Check if any descriptive response is ungraded
        ungraded_responses = responses.filter(
            question__question_type__in=["descriptive", "short_answer", "survey"],
            marks_awarded=None
        ).exists()

        answer_details = []
        for response in responses:
            question = response.question
            if question.question_type in ["descriptive", "short_answer", "survey"]:
                # Handle descriptive-type questions
                answer_details.append({
                    "question_id": question.id,
                    "question_text": question.text,
                    "question_type": question.question_type,
                    "student_answer": response.descriptive_answer,
                    "correct_answer": None,
                    "marks_awarded": response.marks_awarded,
                })
            else:
                # Handle objective-type questions (MCQ, True/False)
                correct_answers = set(Answer.objects.filter(
                    question=question, is_correct=True
                ).values_list("id", flat=True))

                selected_answers = set(response.selected_choices.values_list("id", flat=True))

                answer_details.append({
                    "question_id": question.id,
                    "question_text": question.text,
                    "question_type": question.question_type,
                    "student_answer": list(
                        response.selected_choices.values_list("text", flat=True)
                    ),
                    "correct_answer": list(
                        Answer.objects.filter(
                            question=question, is_correct=True
                        ).values_list("text", flat=True)
                    ),
                    "is_correct": selected_answers == correct_answers,
                })
        
        return Response(
            {
                "test_name": attempt.test.name,
                "student": attempt.student.email,
                "status": "waiting for review" if ungraded_responses else "graded",
                "score": result.score if not ungraded_responses else None,
                "total_marks": result.total_marks,
                "percentage": result.percentage if not ungraded_responses else None,
                "submitted_at": result.submitted_at,
                "answers": answer_details,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)