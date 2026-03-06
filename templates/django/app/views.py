from django.http import HttpResponse


def index(request):
    html = """
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><title>Hello</title></head>
    <body>
      <h1>Hello, World!</h1>
    </body>
    </html>
    """
    return HttpResponse(html.strip(), content_type="text/html; charset=utf-8")
