import logging

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import Response

from services import convert_png_to_svg

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


@router.post("/convert")
async def convert(file: UploadFile = File(...)) -> Response:
    """Upload a PNG, get back an SVG."""
    if not file.content_type or not file.content_type.startswith("image/"):
        return Response("File must be an image", status_code=400)

    png_bytes = await file.read()
    svg_str = convert_png_to_svg(png_bytes)
    return Response(content=svg_str, media_type="image/svg+xml")


