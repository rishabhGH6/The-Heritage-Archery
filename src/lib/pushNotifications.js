// Native Mobile & Browser Push Notifications Helper for Heritage Archery Streak Alerts

export function isPushNotificationSupported() {
  return 'Notification' in window && 'serviceWorker' in navigator;
}

export function getNotificationPermissionState() {
  if (!('Notification' in window)) return 'unsupported';
  return Notification.permission; // 'default', 'granted', 'denied'
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.register('/sw.js');
      console.log('✅ Service Worker registered for push notifications:', reg);
      return reg;
    } catch (err) {
      console.warn('Service worker registration failed:', err);
    }
  }
  return null;
}

export async function requestMobileNotificationPermission() {
  if (!isPushNotificationSupported()) {
    alert("⚠️ Native notifications are not supported by this browser. Try opening in Chrome, Safari, or Edge!");
    return false;
  }

  const permission = await Notification.requestPermission();
  await registerServiceWorker();

  if (permission === 'granted') {
    // Send a welcome test notification immediately so the user sees it work like WhatsApp!
    sendMobileStreakNotification(
      "🔥 Notifications Enabled!",
      "You will now receive daily practice streak reminders on your phone lock screen just like WhatsApp or Instagram! 🏹",
      true
    );
    return true;
  } else if (permission === 'denied') {
    alert("⚠️ Notification permission was blocked in browser settings. Please enable Notifications in your browser/phone settings to receive streak reminders.");
    return false;
  }
  return false;
}

export async function sendMobileStreakNotification(title, body, isTest = false) {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const options = {
    body: body || "🔥 Don't break your practice streak today! Tap to check in now and keep your streak alive.",
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag: isTest ? 'test-notification' : 'streak-reminder',
    renotify: true,
    vibrate: [200, 100, 200, 100, 200],
    data: { url: window.location.origin }
  };

  // Try Service Worker registration first for native phone lock-screen alert
  if ('serviceWorker' in navigator) {
    const reg = await navigator.serviceWorker.ready;
    if (reg && reg.showNotification) {
      reg.showNotification(title, options);
      return;
    }
  }

  // Fallback to standard Notification API
  try {
    new Notification(title, options);
  } catch (e) {
    console.warn("Standard Notification fallback error:", e);
  }
}

// Automatically check if user needs daily streak reminder at 6 PM local time
export function scheduleDailyStreakCheck(streakStatus, userName) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  // Check once on app load
  if (streakStatus && !streakStatus.isCheckedToday) {
    const now = new Date();
    const hours = now.getHours();
    
    // If afternoon/evening (after 12 PM) and not checked in today, send phone notification
    const lastNotifiedDate = localStorage.getItem('last_streak_push_date');
    const todayStr = now.toISOString().split('T')[0];

    if (lastNotifiedDate !== todayStr && hours >= 12) {
      sendMobileStreakNotification(
        `🔥 Streak Alert for ${userName}!`,
        `You haven't checked in for today's practice yet. Keep your ${streakStatus.count}-day streak alive! 🏹`
      );
      localStorage.setItem('last_streak_push_date', todayStr);
    }
  }
}
