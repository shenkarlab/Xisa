from django.http import HttpResponse
from manage_urls_app import searchCeleb
def index(request):
	return HttpResponse('<h1>Hello World! </h1>')

def item_details(request, id):
	return HttpResponse('<p1>in item details with id {0} <p1>'.format(id))

def getFamous(request):
	return HttpResponse(searchCeleb.getFamouses())
	#TODO: return name,picture,bad word, how many said the bad word,how many retweet for page 1

#def getFamous(request,twitterName):
#	return 1
#	#TODO: return name,picture,bad word(array),bad words with count(array) how many said the bad word,how many retweet for page 2