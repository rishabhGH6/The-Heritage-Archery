// Dedicated Photo Persistence Storage Helper to prevent photo loss across sessions

const CUSTOM_PHOTOS_KEY = "heritage_archery_custom_photos_v2";

export const getCustomPhotosMap = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_PHOTOS_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

export const saveCustomArcherPhoto = (archerKey, photoUrl) => {
  if (!archerKey || !photoUrl) return;
  try {
    const currentMap = getCustomPhotosMap();
    currentMap[archerKey] = photoUrl;
    // Also save under lowercased name for reliable lookup
    if (typeof archerKey === 'string') {
      currentMap[archerKey.trim().toLowerCase()] = photoUrl;
    }
    localStorage.setItem(CUSTOM_PHOTOS_KEY, JSON.stringify(currentMap));
  } catch (e) {
    console.warn("Could not save custom archer photo to localStorage:", e);
  }
};

export const resolveArcherPhoto = (archer, defaultFallback = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80") => {
  if (!archer) return defaultFallback;

  const map = getCustomPhotosMap();

  // 1. Check custom photo storage map by archer.id, archer.altId, or archer.name
  if (archer.id && map[archer.id] && map[archer.id].length > 10) return map[archer.id];
  if (archer.altId && map[archer.altId] && map[archer.altId].length > 10) return map[archer.altId];
  if (archer.name && map[archer.name.trim().toLowerCase()] && map[archer.name.trim().toLowerCase()].length > 10) {
    return map[archer.name.trim().toLowerCase()];
  }

  // 2. Check direct archer.photo property if valid
  if (archer.photo && archer.photo.trim().length > 10) {
    return archer.photo;
  }

  return defaultFallback;
};
