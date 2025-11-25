import secrets
from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class Member(models.Model):
    """
    Custom user model for application users.
    """
    login = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'members'
        ordering = ['-created_at']

    def __str__(self):
        return self.login

    def set_password(self, raw_password):
        """Hash and set the password."""
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        """Check if the provided password matches the stored hash."""
        return check_password(raw_password, self.password)

    @property
    def is_authenticated(self):
        """Always return True for authenticated users."""
        return True

    @property
    def is_anonymous(self):
        """Always return False for authenticated users."""
        return False

    def has_perm(self, perm, obj=None):
        """Check if user has a specific permission."""
        return True

    def has_module_perms(self, app_label):
        """Check if user has permissions to view the app."""
        return True


class Token(models.Model):
    """
    Authentication token model for Member users.
    """
    key = models.CharField(max_length=40, primary_key=True)
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='tokens')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'tokens'
        ordering = ['-created_at']

    def __str__(self):
        return self.key

    @staticmethod
    def generate_key():
        """Generate a random token key."""
        return secrets.token_hex(20)

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super().save(*args, **kwargs)
