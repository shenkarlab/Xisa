from django.http import HttpResponse
from manage_urls_app import searchCeleb
from manage_urls_app import celebTweets


def getFamous(request):
	return HttpResponse(searchCeleb.getFamouses())

def getFamousProfile(request,name):
	return HttpResponse(celebTweets.searchTweetsForCeleb(name))
