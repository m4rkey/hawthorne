# Generated by Django 2.0 on 2018-01-25 09:14

import uuid

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
  dependencies = [
    ('core', '0001_initial'),
  ]

  operations = [
    migrations.CreateModel(
      name='Token',
      fields=[
        ('id', models.UUIDField(auto_created=True, default=uuid.uuid4, editable=False, primary_key=True,
                                serialize=False, unique=True)),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('updated_at', models.DateTimeField(auto_now=True)),
      ],
      options={
        'abstract': False,
      },
    ),
    migrations.AlterModelOptions(
      name='user',
      options={'permissions': [('view_user', 'View users'), ('kick_user', 'Kick a user')]},
    ),
    migrations.AddField(
      model_name='token',
      name='owner',
      field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
    ),
  ]
