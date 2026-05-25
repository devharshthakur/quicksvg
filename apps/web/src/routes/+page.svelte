<script lang="ts">
	/* eslint-disable @typescript-eslint/no-unused-vars */
	import { VALID_ACCEPT } from '$lib/constants';

	let selected_file = $state<File | null>(null);
	let uploading = $state<boolean>(false);

	function handleFileSelect(event: Event) {
		const input = event.target as HTMLInputElement;
		const selected_files = input.files![0] ?? null;
	}
</script>

<div class="min-h-screen flex items-center justify-center max-w-4xl mx-auto">
	<div>
		<!-- Choose file -->
		<input
			id="file-input"
			type="file"
			accept={VALID_ACCEPT}
			class="hidden"
			onchange={handleFileSelect}
		/>
		<label for="file-input" class="border-2 px-4 py-1 rounded-sm cursor-pointer inline-block transition hover:scale-110 text-sm">
			{selected_file ? selected_file.name : "Choose File"}
		</label>
	</div>
	<!-- Upload button -->
	 {#if selected_file}
		<button type="button">{uploading ? "uploading...": "upload"}</button>
	 {/if}
</div>
