import logging

import vtracer

logger = logging.getLogger(__name__)


def convert_png_to_svg(png_bytes: bytes) -> str:
    """Convert PNG bytes to SVG string using vtracer."""
    return vtracer.convert_raw_image_to_svg(png_bytes)
