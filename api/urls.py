from django.urls import path
from .views import (
    HelloView,
    RegisterView,
    LoginView,
    ProfileView,
    MessageListView,
    MessageCreateView
)

urlpatterns = [
    path("hello/", HelloView.as_view(), name="hello"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("messages/", MessageListView.as_view(), name="messages-list"),
    path("messages/", MessageCreateView.as_view(), name="messages-create"),
]
