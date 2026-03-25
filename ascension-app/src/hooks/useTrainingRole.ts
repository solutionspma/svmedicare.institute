"use client";

import { useCallback, useEffect, useState } from "react";

export type TrainingRole = "trainee" | "manager" | "admin";

const STORAGE_KEY = "svmi-training-role-v1";

export function useTrainingRole() {
  const [role, setRoleState] = useState<TrainingRole>("trainee");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw === "manager" || raw === "admin" || raw === "trainee") setRoleState(raw);
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  const setTrainingRole = useCallback((next: TrainingRole) => {
    setRoleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return {
    role,
    mounted,
    setTrainingRole,
    isTrainee: role === "trainee",
    isManager: role === "manager" || role === "admin",
    isAdmin: role === "admin",
  };
}
