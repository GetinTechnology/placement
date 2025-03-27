from rest_framework import serializers
from .models import *



class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        
        
        
class TestSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(read_only=True)  # Ensure id is read-only
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())  
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Test
        fields = ['id', 'name', 'category', 'category_name', 'description', 'created_at', 'created_by']
        read_only_fields = ['id', 'created_at', 'created_by']  # Ensure id is read-only

    def create(self, validated_data):
        request = self.context.get('request')
        if not request or not request.user or not request.user.is_authenticated:
            raise serializers.ValidationError("User must be authenticated.")

        validated_data['created_by'] = request.user  # Assign the logged-in user
        return super().create(validated_data)


class TestActiveSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestActive
        fields = ['id', 'test', 'is_active', 'expires_at']
        read_only_fields = ['test', 'expires_at']

    def update(self, instance, validated_data):
        """Update active_status and set expiration time"""
        instance.active_status = validated_data.get('is_active', instance.active_status)

        if instance.active_status:  # If activating, set expiration time
            from django.utils.timezone import now, timedelta
            instance.expires_at = now() + timedelta(hours=1)  # Auto-expire in 1 hour

        instance.save()
        return instance

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



class TestDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Test
        fields = ["id", "title", "description", "questions"]


class TestSetSerializer(serializers.ModelSerializer):
    questions = serializers.SerializerMethodField()

    class Meta:
        model = TestSet
        fields = ['test', 'order_type', 'questions_per_page', 'questions']

    def get_questions(self, obj):
        request = self.context.get('request')  # Get request from context
        page = int(request.query_params.get('page', 1)) if request else 1  # Default to page 1 if request is None

        questions = obj.get_questions()  # Get all questions

        start_index = (page - 1) * obj.questions_per_page
        end_index = start_index + obj.questions_per_page

        paginated_questions = questions[start_index:end_index]
        return QuestionSerializer(paginated_questions, many=True, context={'test_set': obj}).data



class DescriptiveQuestionSerializer(serializers.ModelSerializer):
    student = serializers.CharField(source="attempt.student.username", read_only=True)
    question_text = serializers.CharField(source="question.text", read_only=True)
    max_marks = serializers.IntegerField(source="question.points", read_only=True)

    class Meta:
        model = StudentResponse
        fields = ["id", "student", "question_text", "descriptive_answer", "marks_awarded", "max_marks"]