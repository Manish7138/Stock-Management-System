/**
 * Minimal ESLint configuration to satisfy `npm run lint` in the demo workspace.
 * This is intentionally small to avoid changing linter behavior across the repo.
 */
// Minimal flat config that only sets ignored paths so the legacy .eslintrc.cjs controls rules.
module.exports = [
  {
    ignores: ["node_modules/**", ".next/**", "dist/**"],
  },
]
