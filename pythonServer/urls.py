from django.conf.urls import url

from manage_urls_app import views

urlpatterns = [
    url(r'^$', views.get_celebs),
    url(r'^celeb/(?P<name>[\w\-]+)/$', views.get_celeb_profile, name='Celeb Name')
]
