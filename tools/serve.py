"""Local-only preview with correct static paths and explicit loopback binding."""
import http.server, os
from pathlib import Path
os.chdir(Path(__file__).resolve().parents[1])
http.server.ThreadingHTTPServer(('127.0.0.1',8000),http.server.SimpleHTTPRequestHandler).serve_forever()
