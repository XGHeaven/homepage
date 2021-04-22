import { Source } from "../core";
import { useReducer, useEffect } from "react";

export function useSource<P, D>(
  source: Source<P, D>,
  params: P
): [D | null, boolean, any] {
  const [state, dispatch] = useReducer(
    (
      state: { data: any; loading: boolean; error: any },
      action:
        | { type: "reset" }
        | { type: "success"; data: any }
        | { type: "failed"; error: any }
    ) => {
      switch (action.type) {
        case "reset":
          return { ...state, loading: true };
        case "success":
          return { ...state, data: action.data, loading: false, error: null };
        case "failed":
          return { ...state, loading: false, error: action.error };
      }
    },
    {
      data: null as any,
      loading: true,
      error: null as any,
    }
  );

  const staticData = source.fetchStatic(params);

  useEffect(() => {
    if (!staticData) {
      dispatch({ type: "reset" });
      source
        .fetch(params)
        .then((data) => {
          dispatch({ type: "success", data });
        })
        .catch((e) => {
          dispatch({ type: "failed", error: e });
        });
    }
  }, [source.genKey(params)]);

  if (staticData) {
    return [staticData, false, null];
  }

  return [state.data, state.loading, state.error];
}

export function createUseSource<P, D>(
  source: Source<P, D>
): (params: P) => [D | null, boolean, any] {
  return (params: P) => useSource(source, params);
}
