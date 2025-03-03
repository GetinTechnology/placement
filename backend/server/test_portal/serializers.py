from rest_framework import serializers
from .models import *

class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields = ['id', 'name', 'category', 'description', 'created_at', 'created_by']
        read_only_fields = ['created_at', 'created_by']

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated.")
        
        validated_data['created_by'] = request.user  # Assign the logged-in user
        return super().create(validated_data)




class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']

class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerSerializer(many=True)  # Remove read_only=True

    class Meta:
        model = Question
        fields = ['id', 'question_type', 'test', 'text', 'created_by', 'points', 'answers']
        extra_kwargs = {
            'test': {'required': False},  # Prevents validation error for missing 'test'
            'created_by': {'required': False}  # Prevents validation error for missing 'created_by'
        }

    def create(self, validated_data):
        request = self.context.get("request")
        test = self.context.get("test")

        if not request or not request.user.is_authenticated:
            raise serializers.ValidationError({"created_by": "User authentication required."})

        if not test:
            raise serializers.ValidationError({"test": "Test ID is required."})

        validated_data["created_by"] = request.user
        validated_data["test"] = test

        # Extract and create answer instances
        answers_data = validated_data.pop("answers", [])
        question = Question.objects.create(**validated_data)

        for answer_data in answers_data:
            Answer.objects.create(question=question, **answer_data)

        return question


