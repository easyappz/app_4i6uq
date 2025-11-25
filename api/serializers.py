from rest_framework import serializers
from .models import Member, Token, Message


class MessageSerializer(serializers.Serializer):
    message = serializers.CharField(max_length=200)
    timestamp = serializers.DateTimeField(read_only=True)


class MemberSerializer(serializers.ModelSerializer):
    """Serializer for Member model."""
    
    class Meta:
        model = Member
        fields = ['id', 'login', 'created_at']
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    token = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = ['id', 'login', 'password', 'token']
        read_only_fields = ['id', 'token']

    def get_token(self, obj):
        """Get or create token for the member."""
        token, created = Token.objects.get_or_create(member=obj)
        return token.key

    def validate_login(self, value):
        """Validate that login is unique."""
        if Member.objects.filter(login=value).exists():
            raise serializers.ValidationError("A user with this login already exists.")
        return value

    def create(self, validated_data):
        """Create a new member with hashed password."""
        password = validated_data.pop('password')
        member = Member(**validated_data)
        member.set_password(password)
        member.save()
        return member


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    login = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    id = serializers.IntegerField(read_only=True)
    token = serializers.CharField(read_only=True)

    def validate(self, attrs):
        """Validate login credentials."""
        login = attrs.get('login')
        password = attrs.get('password')

        try:
            member = Member.objects.get(login=login)
        except Member.DoesNotExist:
            raise serializers.ValidationError("Invalid login or password.")

        if not member.check_password(password):
            raise serializers.ValidationError("Invalid login or password.")

        # Get or create token
        token, created = Token.objects.get_or_create(member=member)
        
        attrs['id'] = member.id
        attrs['login'] = member.login
        attrs['token'] = token.key
        attrs['member'] = member
        
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile."""
    
    class Meta:
        model = Member
        fields = ['id', 'login']
        read_only_fields = ['id', 'login']


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for chat messages."""
    author_login = serializers.CharField(source='author.login', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'text', 'author_login', 'created_at']
        read_only_fields = ['id', 'author_login', 'created_at']

    def create(self, validated_data):
        """Create a new message with the current user as author."""
        validated_data['author'] = self.context['request'].user
        return super().create(validated_data)
