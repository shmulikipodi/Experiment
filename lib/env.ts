// Next.js/webpack statically replaces `process.env.VAR_NAME` at build time.
// If the variable isn't set during the Docker build, it gets baked in as undefined.
// Using a function with a dynamic key bypasses that static replacement.
export function getEnv(key: string): string {
  return (process.env as Record<string, string | undefined>)[key] ?? '';
}
