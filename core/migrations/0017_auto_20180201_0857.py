# Generated by Django 2.0 on 2018-02-01 08:57

from django.db import migrations


class Migration(migrations.Migration):
  dependencies = [
    ('core', '0016_auto_20180131_1240'),
  ]

  operations = [
    migrations.AlterModelOptions(
      name='ban',
      options={'permissions': [('view_ban', 'Can view a bans'), ('edit_ban', 'Can edit a ban')]},
    ),
    migrations.AlterModelOptions(
      name='chat',
      options={'permissions': [('view_chat', 'Can view chat logs'),
                               ('view_chat_ip', 'Can view ip of someone in chat logs'),
                               ('view_chat_server', 'Can view current server of someone in chat logs'),
                               ('view_chat_time', 'Can view current time of message in chat logs')]},
    ),
    migrations.AlterModelOptions(
      name='log',
      options={'permissions': [('view_log', 'Can view a server logs')]},
    ),
    migrations.AlterModelOptions(
      name='mutegag',
      options={
        'permissions': [('view_mutegag', 'Can view a mutegag'), ('add_mutegag_mute', 'Can add a mutegag mute'),
                        ('add_mutegag_gag', 'Can add a mutegag gag'), ('edit_mutegag', 'Can edit a mutegag')]},
    ),
    migrations.AlterModelOptions(
      name='server',
      options={'permissions': [('view_server', 'Can view a server'), ('edit_server', 'Can edit a server')]},
    ),
    migrations.AlterModelOptions(
      name='servergroup',
      options={'permissions': [('view_servergroup', 'Can view server groups'),
                               ('edit_servergroup', 'Can edit server groups')]},
    ),
    migrations.AlterModelOptions(
      name='serverrole',
      options={'permissions': [('view_serverrole', 'Can view a server role'),
                               ('edit_serverrole', 'Can edit server role')]},
    ),
    migrations.AlterModelOptions(
      name='user',
      options={'permissions': [('view_user', 'Can view users'), ('kick_user', 'Can kick a user'),
                               ('edit_user', 'Can edit a user')]},
    ),
  ]
