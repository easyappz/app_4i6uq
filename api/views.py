from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from drf_spectacular.utils import extend_schema
from .serializers import (
    MessageSerializer,
    RegisterSerializer,
    LoginSerializer,
    ProfileSerializer,
    ChatMessageSerializer
)
from .models import Message
from .authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated


class HelloView(APIView):
    """
    A simple API endpoint that returns a greeting message.
    """

    @extend_schema(
        responses={200: MessageSerializer}, description="Get a hello world message"
    )
    def get(self, request):
        data = {"message": "Hello!", "timestamp": timezone.now()}
        serializer = MessageSerializer(data)
        return Response(serializer.data)


class RegisterView(APIView):
    """
    API endpoint for user registration.
    """
    authentication_classes = []
    permission_classes = []

    @extend_schema(
        request=RegisterSerializer,
        responses={201: RegisterSerializer},
        description="Register a new user"
    )
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    """
    API endpoint for user login.
    """
    authentication_classes = []
    permission_classes = []

    @extend_schema(
        request=LoginSerializer,
        responses={200: LoginSerializer},
        description="Authenticate user with login and password"
    )
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response({
                'id': serializer.validated_data['id'],
                'login': serializer.validated_data['login'],
                'token': serializer.validated_data['token']
            }, status=status.HTTP_200_OK)
        return Response({"error": str(serializer.errors)}, status=status.HTTP_401_UNAUTHORIZED)


class ProfileView(APIView):
    """
    API endpoint for getting user profile.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: ProfileSerializer},
        description="Get current user profile"
    )
    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MessageListView(APIView):
    """
    API endpoint for getting all chat messages.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        responses={200: ChatMessageSerializer(many=True)},
        description="Get list of all chat messages"
    )
    def get(self, request):
        messages = Message.objects.all().select_related('author').order_by('created_at')
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class MessageCreateView(APIView):
    """
    API endpoint for creating a new chat message.
    """
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        request=ChatMessageSerializer,
        responses={201: ChatMessageSerializer},
        description="Create a new chat message"
    )
    def post(self, request):
        serializer = ChatMessageSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"error": str(serializer.errors)}, status=status.HTTP_400_BAD_REQUEST)
