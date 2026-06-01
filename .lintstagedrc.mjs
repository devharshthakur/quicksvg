/**
 * lint-staged standalone config
 * @see https://github.com/lint-staged/lint-staged#configuration
 * @see https://github.com/lint-staged/lint-staged#how-to-use-lint-staged-in-a-multi-package-monorepo
 *
 * Per lint-staged monorepo pattern: closest config wins and tasks run in the
 * config's directory. App-level configs live in apps/web and apps/api.
 * This root config only matches files with no closer config (root files,
 * scripts/, top-level configs, etc.).
 */
export default {
  "*": "prettier --ignore-unknown --write",
};
