
const MAX_RETRIES = 5;
const BASE_DELAY_MS = 15_000;

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function isRetryableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    /\b429\b/.test(message) ||
    /\b500\b|\b502\b|\b503\b|\b504\b/.test(message) ||
    /fetch failed|timeout|econnreset|econnrefused/.test(message)
  );
}

export async function withValorantRetry<T>(
  operation: () => Promise<T>,
): Promise<T> {
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryableError(error) || attempt === MAX_RETRIES) {
        throw error;
      }

      const delay = BASE_DELAY_MS * 2 ** attempt;

      console.warn(
        `VALORANT request failed. Retrying in ${delay / 1000}s ` +
          `(attempt ${attempt + 1}/${MAX_RETRIES})`,
      );

      await wait(delay);
    }
  }

  throw new Error('VALORANT retry limit reached');
}
