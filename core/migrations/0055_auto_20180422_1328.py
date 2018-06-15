# Generated by Django 2.0.3 on 2018-04-22 13:28

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0054_auto_20180419_0818'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='mainframe',
            options={'permissions': [('view_mainframe', 'Can check mainframe')]},
        ),
        migrations.AlterModelOptions(
            name='user',
            options={'permissions': [('view_user', 'Can view user'), ('kick_user', 'Can kick user'), ('view_group', 'Can view user group'), ('view_settings', 'Can view settings'), ('view_capabilities', 'Can check capabilities')]},
        ),
    ]