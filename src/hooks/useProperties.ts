import { useEffect, useState } from "react";
import type { Property } from "../types/Property";
import { fetchProperties, fetchPropertyById, isApiConfigured } from "../services/propertyApi";
import { properties as demoProperties } from "../data/properties";

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>(isApiConfigured ? [] : demoProperties);
  const [loading, setLoading] = useState(isApiConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchProperties(controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setProperties(items);
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unable to load properties.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  return { properties, loading, error };
}

export function useProperty(id: number | undefined) {
  const [result, setResult] = useState<{
    id: number | undefined;
    property: Property | null;
    error: string | null;
  }>({ id: undefined, property: null, error: null });

  const validId = id !== undefined && Number.isSafeInteger(id) && id > 0;
  useEffect(() => {
    if (!validId) return;

    const controller = new AbortController();
    fetchPropertyById(id, controller.signal)
      .then((property) => {
        if (!controller.signal.aborted) {
          setResult({ id, property, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setResult({
            id,
            property: null,
            error: err instanceof Error ? err.message : "Unable to load property.",
          });
        }
      });

    return () => controller.abort();
  }, [id, validId]);

  const matchesCurrentId = validId && result.id === id;
  return {
    property: matchesCurrentId ? result.property : null,
    loading: validId && !matchesCurrentId,
    error: matchesCurrentId ? result.error : null,
  };
}
