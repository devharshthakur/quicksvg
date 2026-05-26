<script lang="ts">
	/* eslint-disable svelte/no-at-html-tags */

	import { VALID_ACCEPT } from '$lib/constants';
	import { convertImage } from './page.remote';
	import DOMPurify from 'dompurify';
	import CopySvgButton from '$lib/components/CopySvgButton.svelte';

	let selected_file = $state<File | null>(null);
	let uploading = $state<boolean>(false);
	let converted_svg = $state<string | null>(null);
	let sanitized_svg = $derived(
		converted_svg ? (DOMPurify.sanitize?.(converted_svg) ?? converted_svg) : null
	); // sanitize for XSS attacks
	let error = $state<string | null>(null);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		selected_file = input.files![0] ?? null;
	}

	async function handleUpload() {
		if (!selected_file) return;

		try {
			const bytes = new Uint8Array(await selected_file.arrayBuffer());
			converted_svg = await convertImage({ bytes, name: selected_file.name });
		} catch (e) {
			error = (e as Error).message;
		}
	}
</script>

<div class="min-h-screen flex flex-col items-center justify-center max-w-4xl mx-auto gap-6 p-4">
	<div class="flex items-center gap-4">
		<!-- Choose file -->
		<input
			id="file-input"
			type="file"
			accept={VALID_ACCEPT}
			class="hidden"
			onchange={handleFileSelect}
		/>
		<label
			for="file-input"
			class="border-2 border-gray-300 px-4 py-2 rounded-lg cursor-pointer inline-block transition hover:bg-gray-100 text-sm select-none"
		>
			{selected_file ? selected_file.name : 'Choose File'}
		</label>

		<!-- Upload button -->
		{#if selected_file}
			<button
				type="button"
				onclick={handleUpload}
				disabled={uploading}
				class="bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{uploading ? 'Uploading...' : 'Upload'}
			</button>
		{/if}
	</div>

	{#if sanitized_svg}
		<div>{@html sanitized_svg}</div>
		<CopySvgButton svg={converted_svg!} />
	{/if}

	{#if error}
		<div class="text-red-600 font-semibold">{error}</div>
	{/if}
</div>
