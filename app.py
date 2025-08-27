from fastapi import FastAPI, Body, HTTPException, Response
from pydantic import BaseModel
from weasyprint import HTML, CSS
from typing import Optional
import re

app = FastAPI()

# Optional: block remote fetching (safer). Only allow data: and local files.
def deny_remote_url_fetcher(url):
    # WeasyPrint calls this for images/fonts/etc.
    href = url.get("url", "")
    if href.startswith("data:") or href.startswith("file://"):
        return url
    # Disallow http(s) and other schemes
    raise ValueError("Remote fetching disabled")

class PdfJob(BaseModel):
    html: str                  # your full HTML string
    css: Optional[str] = None  # optional extra CSS bundle (e.g., prebuilt Tailwind subset)
    page_size: str = "A5"      # A4, Letter, etc.

@app.post("/render")
def render_pdf(job: PdfJob):
    try:
        stylesheets = [
            CSS(string=f"@page {{ size: {job.page_size}; margin: 10mm; }}")
        ]
        if job.css:
            stylesheets.append(CSS(string=job.css))

        pdf_bytes = HTML(
            string=job.html,
            base_url=".",               # local resolution root
            url_fetcher=deny_remote_url_fetcher
        ).write_pdf(stylesheets=stylesheets)

        return Response(content=pdf_bytes, media_type="application/pdf")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"PDF generation failed: {e}")

@app.get("/healthz")
def healthz():
    return {"ok": True}