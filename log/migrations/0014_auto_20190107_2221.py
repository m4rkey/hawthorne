# Generated by Django 2.1.1 on 2019-01-07 22:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('log', '0013_auto_20190107_0116'),
    ]

    operations = [
        migrations.AlterField(
            model_name='serverdatapoint',
            name='map',
            field=models.CharField(max_length=255, null=True),
        ),
        migrations.AlterField(
            model_name='serverdatapoint',
            name='time_left',
            field=models.FloatField(default=0.0),
        ),
        migrations.AlterField(
            model_name='serverdatapoint',
            name='uptime',
            field=models.FloatField(default=0.0),
        ),
    ]
