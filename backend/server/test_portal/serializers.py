from rest_framework import serializers
from .models import Test

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
