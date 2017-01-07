from django.http import HttpResponse
from django.shortcuts import render

from manage_urls_app import celeb_search
from manage_urls_app import celeb_tweets


def get_celebs(request):
    return HttpResponse(celeb_search.get_celebs(), content_type="application/json")


def get_celeb_profile(request, name):
    return HttpResponse(celeb_tweets.get_tweets(name), content_type="application/json")


def index(request):
    return render(request, "index.html")

