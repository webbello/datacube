# Generated by Django 2.2.2 on 2019-06-12 18:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0002_userprofileinfo'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofileinfo',
            name='indicesList',
            field=models.CharField(default="'NDVI':(nir-r)/(nir+r)", max_length=20000),
            preserve_default=False,
        ),
    ]
