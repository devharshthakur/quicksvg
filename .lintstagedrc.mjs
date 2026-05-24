import path from 'node:path';

/**
 * lint-staged standalone config
 * @see https://github.com/lint-staged/lint-staged#configuration
 *
 * prettier & eslint live inside apps/web with per-package plugins.
 * ruff lives inside apps/api's uv-managed venv.
 * Each command cds into the package so tools find their configs & plugins.
 */
const gitRoot = process.cwd();

export default {
	'apps/web/**/*.{js,ts,svelte,json,css,md,html}': (filenames) => {
		const relative = filenames.map((f) =>
			path.relative(path.join(gitRoot, 'apps/web'), f)
		);
		const commands = [
			`cd apps/web && prettier --write ${relative.join(' ')}`
		];
		const lintFiles = relative.filter((f) => /\.(js|ts|svelte)$/.test(f));
		if (lintFiles.length) {
			commands.push(
				`cd apps/web && eslint --fix ${lintFiles.join(' ')}`
			);
		}
		return commands;
	},
	'apps/api/**/*.py': (filenames) => {
		const relative = filenames.map((f) =>
			path.relative(path.join(gitRoot, 'apps/api'), f)
		);
		return [`cd apps/api && uv run ruff check --fix ${relative.join(' ')}`];
	}
};
