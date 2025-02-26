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
        fields = ['id', 'text', 'is_correct'   ]

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'
        extra_kwargs = {
            'test': {'required': False},  # Prevents validation error for missing 'test'
            'created_by': {'required': False}  # Prevents validation error for missing 'created_by'
        }

    def create(self, validated_data):
        request = self.context.get("request")
        
        # Ensure request.user is set
        if request and hasattr(request, "user") and request.user.is_authenticated:
            validated_data["created_by"] = request.user
        else:
            raise serializers.ValidationError({"created_by": "User authentication required."})
        
        return super().create(validated_data)

