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

logger = logging.getLogger(__name__)



@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def add_category(request):
    if request.method == 'GET':  # ✅ Handle GET request
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method == 'POST':  # ✅ Handle POST request
        category_name = request.data.get('name', '').strip()

        if not category_name:
            return Response({'error': 'Category name is required.'}, status=status.HTTP_400_BAD_REQUEST)

        if Category.objects.filter(name__iexact=category_name).exists():
            return Response({'error': 'Category already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        category = Category.objects.create(name=category_name)
        serializer = CategorySerializer(category)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



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
        return Response({"is_active": False}, status=status.HTTP_200_OK)



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
    Submits the test, calculates the score dynamically, and stores only the final result.
    """
    try:
        student = request.user
        test = get_object_or_404(Test, id=test_id)

        # Ensure test attempt exists or create one
        attempt, created = TestAttempt.objects.get_or_create(
            test=test, student=student, defaults={"submitted": False}
        )

        if attempt.submitted:
            return Response(
                {"message": "Test already submitted."}, status=status.HTTP_400_BAD_REQUEST
            )

        print(f"Attempt Found: {attempt}, Created: {created}")

        # Get submitted answers from request
        submitted_answers = request.data.get("responses", {})  # Expecting a dictionary {question_id: [selected_choice_ids]}
        print(submitted_answers)
        
        score = 0
        total_marks = 0

        for answer in submitted_answers:
            question_id = answer.get("question_id")
            selected_choice_ids = answer.get("selected_choices", [])  # Ensure it's a list

            question = get_object_or_404(Question, id=question_id)
            correct_answer_ids = set(
            Answer.objects.filter(question=question, is_correct=True).values_list("id", flat=True)
            )

            # Calculate score
            if set(selected_choice_ids) == correct_answer_ids:
                score += question.points  # Assume each question has a "points" field

            total_marks += question.points

        total_marks = max(total_marks, 1)  #

        # Update or create StudentTestResult
        result, created = StudentTestResult.objects.update_or_create(
            attempt=attempt,
            defaults={
                "score": score,
                "total_marks": total_marks,
                "percentage": (score / total_marks) * 100,
            },
        )

        # Mark Attempt as Submitted
        attempt.submitted = True
        attempt.save()

        return Response(
            {
                "message": "Test submitted successfully!",
                "score": result.score,
                "total_marks": result.total_marks,
                "percentage": result.percentage,
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


@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_student_result(request, test_id):
    """
    Fetch the student's test result using test ID.
    """
    try:
        attempt = get_object_or_404(TestAttempt, test_id=test_id, student=request.user)

        if not hasattr(attempt, "result"):
            return Response(
                {"message": "Test result not found"}, status=status.HTTP_404_NOT_FOUND
            )

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

        return Response(
            {
                "test_name": attempt.test.name,
                "student":attempt.student.email,
                "score": result.score,
                "total_marks": result.total_marks,
                "percentage": result.percentage,
                "submitted_at": result.submitted_at,
                "answers": answer_details,
            },
            status=status.HTTP_200_OK,
        )

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            }
            for result in results
        ]

        return Response({"results": results_data}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)





@api_view(["GET"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_pending_evaluations(request, test_id):
    """
    Fetch all student responses for a test where grading is needed (descriptive and single-choice).
    """
    try:
        attempts = TestAttempt.objects.filter(test_id=test_id, submitted=True)
        pending_evaluations = []

        for attempt in attempts:
            responses = StudentResponse.objects.filter(attempt=attempt)

            for response in responses:
                question = response.question

                # Fetch descriptive answers and single-answer questions
                if question.answer_type in ["descriptive", "single"]:
                    pending_evaluations.append({
                        "attempt_id": attempt.id,
                        "student_name": attempt.student.username,
                        "student_email": attempt.student.email,
                        "question_id": question.id,
                        "question_text": question.text,
                        "answer_type": question.answer_type,
                        "student_answer": response.descriptive_answer if question.answer_type == "descriptive" else list(response.selected_choices.values_list("text", flat=True)),
                        "correct_answer": list(Answer.objects.filter(question=question, is_correct=True).values_list("text", flat=True)) if question.answer_type == "single" else "Manual Grading Required",
                        "is_correct": None if question.answer_type == "descriptive" else set(response.selected_choices.values_list("id", flat=True)) == set(Answer.objects.filter(question=question, is_correct=True).values_list("id", flat=True))
                    })

        return Response({"pending_evaluations": pending_evaluations}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(["POST"])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def evaluate_answers(request):
    """
    API to submit marks for descriptive answers.
    """
    try:
        evaluations = request.data.get("evaluations", [])

        for evaluation in evaluations:
            attempt = get_object_or_404(TestAttempt, id=evaluation["attempt_id"])
            response = get_object_or_404(StudentResponse, attempt=attempt, question_id=evaluation["question_id"])

            # Store marks for descriptive answers
            if response.question.answer_type == "descriptive":
                response.marks_awarded = evaluation["marks_awarded"]
                response.save()

            # Update test result if necessary
            attempt_result, _ = StudentTestResult.objects.get_or_create(attempt=attempt)
            total_marks = sum([resp.question.points for resp in attempt.responses.all()])
            total_score = sum([resp.marks_awarded for resp in attempt.responses.all() if resp.marks_awarded is not None])

            attempt_result.score = total_score
            attempt_result.total_marks = total_marks
            attempt_result.percentage = (total_score / total_marks) * 100 if total_marks > 0 else 0
            attempt_result.save()

        return Response({"message": "Evaluations submitted successfully!"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

