# Generated by indietyp

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0036_auto_20180303_1956'),
    ]

    operations = [
        migrations.RenameField(
            model_name='ban',
            old_name='issuer',
            new_name='created_by',
        ),
        migrations.RenameField(
            model_name='mutegag',
            old_name='issuer',
            new_name='created_by',
        ),
    ]
