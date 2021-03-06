# Generated by Django 2.1.1 on 2018-12-31 00:40

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('log', '0009_auto_20180324_2332'),
    ]

    operations = [
        migrations.AlterField(
            model_name='serverchat',
            name='id',
            field=models.UUIDField(auto_created=True, db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='userip',
            name='id',
            field=models.UUIDField(auto_created=True, db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='usernamespace',
            name='id',
            field=models.UUIDField(auto_created=True, db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='useronlinetime',
            name='id',
            field=models.UUIDField(auto_created=True, db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True),
        ),
    ]
