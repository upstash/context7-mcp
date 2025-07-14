/**
 * Port selection utility that prioritizes process.env.PORT, then CLI flag, then default
 */
export function getServerPort(
  envPort?: string,
  cliPort?: string,
  defaultPort: number = 3000
): number {
  // 1. Check environment variable first
  if (envPort) {
    const parsed = parseInt(envPort, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  // 2. Check CLI flag
  if (cliPort) {
    const parsed = parseInt(cliPort, 10);
    if (!isNaN(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  // 3. Default
  return defaultPort;
}

export const SERVER_HOST = "0.0.0.0";
