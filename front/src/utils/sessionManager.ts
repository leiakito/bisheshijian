const RESIDENT_SESSION_KEY = "resident_session";
const MAINTENANCE_SESSION_KEY = "maintenance_session";

export interface ResidentSession {
  name: string;
  phone?: string;
}

export interface MaintenanceSession {
  name: string;
}

function getSessionStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.sessionStorage;
}

export function setResidentSession(session: ResidentSession): void {
  const storage = getSessionStorage();
  if (!storage) return;
  storage.setItem(RESIDENT_SESSION_KEY, JSON.stringify(session));
}

export function getResidentSession(): ResidentSession | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  const raw = storage.getItem(RESIDENT_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ResidentSession;
  } catch {
    return null;
  }
}

export function clearResidentSession(): void {
  const storage = getSessionStorage();
  if (!storage) return;
  storage.removeItem(RESIDENT_SESSION_KEY);
}

export function isResidentAuthenticated(): boolean {
  return !!getResidentSession();
}

export function setMaintenanceSession(session: MaintenanceSession): void {
  const storage = getSessionStorage();
  if (!storage) return;
  storage.setItem(MAINTENANCE_SESSION_KEY, JSON.stringify(session));
}

export function getMaintenanceSession(): MaintenanceSession | null {
  const storage = getSessionStorage();
  if (!storage) return null;
  const raw = storage.getItem(MAINTENANCE_SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as MaintenanceSession;
  } catch {
    return null;
  }
}

export function clearMaintenanceSession(): void {
  const storage = getSessionStorage();
  if (!storage) return;
  storage.removeItem(MAINTENANCE_SESSION_KEY);
}

export function isMaintenanceAuthenticated(): boolean {
  return !!getMaintenanceSession();
}
