#!/usr/bin/env python
import os
import sys
import django

# Add the project directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set the Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mysite.settings')

# Setup Django
django.setup()

# Test if Django is working
from django.conf import settings
print("Django settings loaded successfully!")
print(f"DEBUG mode: {settings.DEBUG}")
print(f"Installed apps: {settings.INSTALLED_APPS}")

# Test if singlepage app is accessible
try:
    from singlepage import views
    print("Singlepage app imported successfully!")
except ImportError as e:
    print(f"Error importing singlepage app: {e}")

print("Django configuration test completed!")