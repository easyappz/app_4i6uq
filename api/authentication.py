from rest_framework import authentication, exceptions
from .models import Token


class TokenAuthentication(authentication.BaseAuthentication):
    """
    Token-based authentication for Member users.
    Clients should authenticate by passing the token key in the 'Authorization'
    HTTP header, prepended with the string 'Token '.  For example:

        Authorization: Token 401f7ac837da42b97f613d789819ff93537bee6a
    """
    keyword = 'Token'

    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header:
            return None

        try:
            keyword, token_key = auth_header.split()
        except ValueError:
            raise exceptions.AuthenticationFailed('Invalid token header. No credentials provided.')

        if keyword.lower() != self.keyword.lower():
            return None

        return self.authenticate_credentials(token_key)

    def authenticate_credentials(self, key):
        try:
            token = Token.objects.select_related('member').get(key=key)
        except Token.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid token.')

        return (token.member, token)

    def authenticate_header(self, request):
        return self.keyword
