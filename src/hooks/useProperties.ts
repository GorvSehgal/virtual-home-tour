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
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setProperty(null);
    if (id === undefined || !Number.isSafeInteger(id) || id <= 0) {
      setProperty(null);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    fetchPropertyById(id, controller.signal)
      .then((result) => {
        if (!controller.signal.aborted) setProperty(result);
      })
      .catch((err: unknown) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Unable to load property.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id]);

  return { property, loading, error };
}
