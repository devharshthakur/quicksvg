<script lang="ts">
	import { Sun, Moon } from '@lucide/svelte';
	import { toggleMode } from 'mode-watcher';
</script>

<button
	type="button"
	onclick={toggleMode}
	class="inline-flex items-center justify-center rounded-md border border-border bg-background p-2 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
	aria-label="Toggle theme"
>
	<Sun class="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
	<Moon class="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
</button>
