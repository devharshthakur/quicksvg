import logging

from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse, Response

from src.constants import MAX_SIZE, MAX_SIZE_MB, VALID_TYPES
from src.services import convert_png_to_svg

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api")


@router.post("/convert")
async def convert(file: UploadFile = File(...)) -> Response:
    """Upload a PNG, get back an SVG."""
    if file.content_type not in VALID_TYPES:
        return JSONResponse(
            {"error": f"unsupported format: {file.content_type}. Use {VALID_TYPES}"},
            status_code=400,
        )

    png_bytes = await file.read()

    if len(png_bytes) > MAX_SIZE:
        return JSONResponse({"error": f"File too large. Max {MAX_SIZE_MB}"})

    try:
        svg_str = convert_png_to_svg(png_bytes)
        return Response(content=svg_str, media_type="image/svg+xml")
    except Exception as e:
        logger.exception("Conversion failed")
        return JSONResponse({"error": "Conversion failed"}, status_code=500)
