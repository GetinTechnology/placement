from rest_framework.decorators import api_view, permission_classes,authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Test
from .serializers import *
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404


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
        serializer = TestSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(created_by=request.user)
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




