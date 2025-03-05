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
        category_id = request.data.get('category', None)

        if not category_id:
            return Response({'error': 'Category is required.'}, status=status.HTTP_400_BAD_REQUEST)

        category = Category.objects.filter(id=category_id).first()
        if not category:
            return Response({'error': 'Invalid category selection.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = TestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(created_by=request.user, category=category)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

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


