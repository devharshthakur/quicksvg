<script lang="ts">
	import { Copy, Check } from '@lucide/svelte';

	let { svg }: { svg: string } = $props();

	let copied = $state(false);
	let timeout_id: ReturnType<typeof setTimeout> | undefined;

	async function handleCopy() {
		await navigator.clipboard.writeText(svg);
		copied = true;
		clearTimeout(timeout_id); // clear previous timeouts
		timeout_id = setTimeout(() => {
			copied = false;
		}, 2000);
	}
</script>

<button
	type="button"
	onclick={handleCopy}
	class="inline-flex items-center gap-2 bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-800 transition cursor-pointer"
>
	{#if copied}
		<Check class="size-4" />
		<span>Copied!</span>
	{:else}
		<Copy class="size-4" />
		<span>Copy SVG</span>
	{/if}
</button>
