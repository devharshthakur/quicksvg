import { rmSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const root = join(__dirname, "..");

const dirs: string[] = [
	// Root
	".turbo",
	// Web
	"apps/web/build",
	"apps/web/.svelte-kit",
	// API
	"apps/api/.ruff_cache",
];

let cleaned = 0;
let skipped = 0;

for (const dir of dirs) {
	const target = join(root, dir);

	if (!existsSync(target)) {
		console.log(`  - skipped (not found): ${dir}`);
		skipped++;
		continue;
	}

	rmSync(target, { recursive: true, force: true });
	console.log(`  cleaned: ${dir}`);
	cleaned++;
}

console.log(`\ndone — ${cleaned} cleaned, ${skipped} skipped`);
