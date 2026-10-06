"""Local static preview that applies the built Pages _redirects rules. No deployment."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit
redirects = {}
for line in Path('dist/_redirects').read_text().splitlines():
    source, target, status = line.split()
    redirects[source] = (target, int(status))
class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='dist', **kwargs)
    def do_GET(self):
        redirect = redirects.get(urlsplit(self.path).path)
        if redirect:
            self.send_response(redirect[1])
            self.send_header('Location', redirect[0])
            self.end_headers()
            return
        super().do_GET()
ThreadingHTTPServer(('127.0.0.1',4322), Handler).serve_forever()
