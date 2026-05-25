import { command } from '$app/server';
import { API_BASE_URL } from '$env/static/private';
import { z } from 'zod';
import { getMimeType } from '$lib/constants';

const convertSchema = z.object({
	bytes: z.instanceof(Uint8Array, { message: 'file data must be a Uint8Array' }),
	name: z.string().min(1, 'filename is required')
});

export const convertImage = command(convertSchema, async ({ bytes, name }) => {
	const formData = new FormData();
	const blob = new Blob([bytes as BlobPart], { type: getMimeType(name) });
	formData.append('file', blob, name);

	const res = await fetch(`${API_BASE_URL}/api/convert`, {
		method: 'POST',
		body: formData
	});

	if (!res.ok) {
		let message = 'Conversion failed';

		try {
			const body = await res.json();
			message = body.error ?? message;
		} catch (e) {
			console.error('Failed to parse API error response:', e);
		}

		throw new Error(message);
	}

	return await res.text();
});
