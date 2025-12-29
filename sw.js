const CACHE_NAME = 'queue-app-FINAL-FIX-v14'; // העליתי גרסה ל-10

const urlsToCache = [
  './',                  // התיקייה עצמה
  './index.html',   
  './price-compare.html',        // הקובץ הראשי (חובה!)
  './manifest.json', // המניפסט שלך
  './icon.png' 
  './sw.js'  
  ];

// --- מכאן והלאה הקוד שלך מצוין, לא נגעתי ---

// התקנה
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching essential files...');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache error:', err)) // הוספתי לוג שגיאות למקרה שמשהו חסר
  );
});

// הפעלה ומחיקת ישנים
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) return caches.delete(cache);
        })
      );
    })
  );
  return self.clients.claim();
});

// שליפה מהירה
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // אסטרטגיה: נסה רשת, אם אין אינטרנט - קח מהזיכרון
  event.respondWith(
    fetch(event.request)
      .catch(() => caches.match(event.request))
  );
});

