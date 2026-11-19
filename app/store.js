// Progress and settings storage for the Leonida Platinum tracker.
// Progress lives only in this browser (localStorage); export/import move it as JSON.
export const PROGRESS_KEY = 'leonida-platinum-progress-v1';
export const SETTINGS_KEY = 'leonida-platinum-settings-v1';
export const TOTAL_TROPHIES = 55;

export function isValidId(id) {
  return Number.isInteger(id) && id >= 1 && id <= TOTAL_TROPHIES;
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (raw === null) return null;
    const parsed = JSON.parse(raw);
    const ids = Array.isArray(parsed) ? parsed : parsed.earned;
    if (!Array.isArray(ids)) return new Set();
    return new Set(ids.filter(isValidId));
  } catch {
    return new Set();
  }
}

export function saveProgress(earned) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify([...earned].sort((a, b) => a - b)));
}

export function loadSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) ?? '{}');
  } catch {
    return {};
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function exportProgress(earned) {
  const payload = {
    app: 'leonida-platinum',
    version: 1,
    exportedAt: new Date().toISOString(),
    earned: [...earned].sort((a, b) => a - b),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
  return payload.earned.length;
}

export function parseImport(text) {
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: 'That file is not valid JSON.' };
  }
  const raw = Array.isArray(parsed) ? parsed : parsed.earned;
  if (!Array.isArray(raw)) {
    return { ok: false, error: 'Expected a JSON array of trophy ids, or an object with an "earned" array.' };
  }
  const ids = raw.filter(isValidId);
  if (ids.length === 0 && raw.length > 0) {
    return { ok: false, error: 'No valid trophy ids (1-55) found in that file.' };
  }
  return { ok: true, earned: new Set(ids) };
}

export function resetProgress() {
  localStorage.removeItem(PROGRESS_KEY);
  return new Set();
}
