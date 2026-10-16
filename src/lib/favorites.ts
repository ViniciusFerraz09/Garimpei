/**
 * Favoritos salvos apenas no dispositivo (localStorage). Não há sincronização
 * com conta — o visitante não precisa de login para favoritar.
 */

const STORAGE_KEY = "garimpei:favoritos";

type Listener = () => void;

const listeners = new Set<Listener>();

const readStorage = (): string[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is string => typeof item === "string");
  } catch {
    return [];
  }
};

let snapshot: string[] = readStorage();

const emit = () => {
  listeners.forEach((listener) => listener());
};

const persist = (next: string[]) => {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Sem espaço ou storage bloqueado: mantemos o estado em memória.
  }
  emit();
};

let listeningToStorage = false;

const ensureStorageListener = () => {
  if (listeningToStorage || typeof window === "undefined") return;
  listeningToStorage = true;
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    snapshot = readStorage();
    emit();
  });
};

export const subscribeToFavorites = (listener: Listener): (() => void) => {
  ensureStorageListener();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getFavoritesSnapshot = (): string[] => snapshot;

export const getServerFavoritesSnapshot = (): string[] => [];

export const toggleFavorite = (productId: string): boolean => {
  const isFavorite = snapshot.includes(productId);
  persist(
    isFavorite
      ? snapshot.filter((id) => id !== productId)
      : [...snapshot, productId],
  );
  return !isFavorite;
};

export const isFavorite = (productId: string): boolean =>
  snapshot.includes(productId);
