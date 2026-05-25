export const MAX_SIZE_MB = '10 MB';
export const VALID_TYPES = ['PNG', 'JPEG', 'WebP'];
export const VALID_ACCEPT = 'image/png,image/jpeg,image/webp';

export const MIME_MAP: Record<string, string> = {
	png: 'image/png',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	webp: 'image/webp'
};

export function getMimeType(filename: string): string {
	const ext = filename.split('.').pop()?.toLowerCase() ?? '';
	return MIME_MAP[ext] ?? 'application/octet-stream';
}
