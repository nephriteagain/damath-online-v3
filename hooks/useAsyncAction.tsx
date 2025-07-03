import { FirebaseError } from "firebase/app";
import { useState, useCallback } from "react";

type ActionState<T> = {
  data: T | null;
  error: Error | FirebaseError | null;
  isLoading: boolean;
  isError: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AsyncFunction<TArgs extends any[], TResult> = (...args: TArgs) => Promise<TResult>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAsyncAction<TArgs extends any[], TResult>(
  fn: AsyncFunction<TArgs, TResult>
): [(...args: TArgs) => Promise<TResult|undefined>, ActionState<TResult>] {
  const [data, setData] = useState<TResult | null>(null);
  const [error, setError] = useState<Error | FirebaseError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isError = !!error;

  const run = useCallback(async (...args: TArgs) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fn(...args);
      setData(result);
      return result;
    } catch (err) {
      if (err instanceof FirebaseError || err instanceof Error) {
        setError(err);
      } else {
        setError(new Error("Unknown error occurred."));
      }
    } finally {
      setIsLoading(false);
    }
  }, [fn]);

  return [run, { data, error, isLoading, isError }];
}
