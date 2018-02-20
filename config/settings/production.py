"""
Production Configurations
"""
from .common import *

# Disable debugging in production environment
DEBUG = False

# Production database settings
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'trialscompendium',
        'USER': 'postgres',
        'PASSWORD': 'makeles',
        'HOST': '127.0.0.1',
        'PORT': '3306',
    }
}
