import logging

from core.models import Token, User
from django.conf import settings
from django.utils import timezone, translation
from hashids import Hashids as Hasher
from uuid import UUID

logger = logging.getLogger(__name__)


class LanguageMiddleware:
  """
  Detect the user's browser language settings and activate the language.
  If the default language is not supported, try secondary options.  If none of the
  user's languages are supported, then do nothing.
  """

  def __init__(self, get_response):
    self.get_response = get_response

  def is_supported_language(self, language_code):
    supported_languages = dict(settings.LANGUAGES).keys()
    return language_code in supported_languages

  def get_browser_language(self, request):
    browser_language_code = request.META.get('HTTP_ACCEPT_LANGUAGE', None)
    if browser_language_code is not None:
      logger.info('HTTP_ACCEPT_LANGUAGE: %s' % browser_language_code)
      languages = [language for language in browser_language_code.split(',') if
                   '=' not in language]
      for language in languages:
        language_code = language.split('-')[0]
        if self.is_supported_language(language_code):
          return language_code
        else:
          logger.info('Unsupported language found: %s' % language_code)

  def __call__(self, request):
    language_code = self.get_browser_language(request)

    if language_code:
      translation.activate(language_code)

    response = self.get_response(request)
    return response


class TokenMiddleware:
    def __init__(self, get_response):
      self.get_response = get_response

    def __retrieve__(self, request):
      token, user = None, None

      if 'HTTP_X_MODIFIED_BY' in request.META:
        user = request.META['HTTP_X_MODIFIED_BY']
      if 'HTTP_X_TOKEN' in request.META:
        token = request.META['HTTP_X_TOKEN']
      else:
        return token

      if len(token) == 25:
        hasher = Hasher(salt=settings.SECRET_KEY)
        token = UUID(hasher.decode(token))

      token = Token.objects.filter(id=token, is_active=True, is_anonymous=False)
      if token:
        token = token[0]
        request.user = token.owner

        user = User.objects.filter(id=user)
        if token.has_perm('core.propagate_token') and user:
          request.user = user[0]

        if token.due and token.due < timezone.now():
          token.is_active = False
          token.save()

          token = None
      else:
        token = None

      return token

    def __call__(self, request):
      if request.path.startswith('/api/v1'):
        request.token = self.__retrieve__(request)

      response = self.get_response(request)
      return response
