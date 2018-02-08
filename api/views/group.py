from core.models import User
from django.forms.models import model_to_dict
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import Group, Permission
from core.decorators.api import json_response, validation
from core.decorators.auth import authentication_required, permission_required
from django.views.decorators.http import require_http_methods


@csrf_exempt
@json_response
@authentication_required
@permission_required('group.list')
@validation('group.list')
@require_http_methods(['GET', 'PUT'])
def list(request, validated={}, *args, **kwargs):
  if request.method == 'GET':
    groups = Group.objects.filter(name__contains=validated['match']).values('id', 'name')

    limit = validated['limit']
    offset = validated['offset']
    groups = groups[offset:] if limit < 0 else groups[offset:limit]

    return [g for g in groups]
  else:
    perms = []
    for perm in validated['permissions']:
      perm = perm.split('.')
      for p in Permission.objects.filter(name=perm[1]):
        if p.content_type.app_label == perm[0]:
          perms.append(p)

    users = []
    for user in validated['members']:
      for u in User.objects.filter(id=user):
        users.append(u)

    group = Group(name=validated['name'])
    group.save()
    group.permissions.set(perms)
    group.user_set.set(users)
    group.save()

    return 'passed'


@csrf_exempt
@json_response
@authentication_required
@permission_required('group.detailed')
@validation('group.detailed')
@require_http_methods(['GET', 'POST', 'DELETE'])
def detailed(request, g=None, validated={}, *args, **kwargs):
  group = Group.objects.get(id=g)

  if request.method == 'GET':
    g = model_to_dict(group)
    g['members'] = [str(a.id) for a in group.user_set.all()]
    g['permissions'] = ["{}.{}".format(p.content_type.app_label, p.codename) for p in group.permissions.all()]

    return g

  elif request.method == 'POST':
    if validated['name'] is not None:
      group.name = validated['name']

    if len(validated['members']) > 0:
      users = []
      for m in validated['members']:
        try:
          users.append(User.objects.get(id=m))
        except Exception:
          continue
      group.user_set.set(users)

    if len(validated['permissions']) > 0:
      perms = []
      for p in validated['permissions']:
        p = p.split('.')
        try:
          perms.append(Permission.objects.get(content_type__app_label=p[0], codename=p[1]))
        except Exception:
          continue
      group.permissions.set(perms)

    group.save()

  elif request.method == 'DELETE':
    group.delete()

  return 'passed'