# Python script for local development/server

from http.server import SimpleHTTPRequestHandler, HTTPServer

PORT = 8000

class MyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        super().do_GET()

if __name__ == "__main__":
    print(f"Serving at http://localhost:{PORT}")
    server = HTTPServer(('localhost', PORT), MyHandler)
    server.serve_forever()

# run in terminal 'python app.py'