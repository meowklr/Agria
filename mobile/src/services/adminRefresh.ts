let listeners: (() => void)[] = [];

export function triggerAdminRefresh() {
  listeners.forEach(fn => fn());
}

export function onAdminRefresh(fn: () => void): () => void {
  listeners.push(fn);
  return () => { listeners = listeners.filter(l => l !== fn); };
}
