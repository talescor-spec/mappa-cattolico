// Saving a recovery contact must never be a prerequisite for buying the book.
// Keep the request alive during checkout navigation, but bound the buyer's wait.
export async function captureOrder(payload, { fetchImpl = fetch, timeoutMs = 4000 } = {}) {
 let timer;
 try {
  const save = Promise.resolve(fetchImpl('/api/bible-capture', {
   method: 'POST', headers: { 'Content-Type': 'application/json' },
   credentials: 'same-origin', keepalive: true, body: JSON.stringify(payload),
  })).then(async response => {
   const data = await response.json();
   return response.ok && data.ok === true && data.offer === 'book' ? data : null;
  }).catch(() => null);
  return await Promise.race([save, new Promise(resolve => { timer = setTimeout(() => resolve(null), timeoutMs); })]);
 } catch {
  return null;
 } finally {
  clearTimeout(timer);
 }
}
