import { writable, derived } from 'svelte/store';

// Store des biens
export const propertiesStore = writable([]);
export const propertiesLoading = writable(false);

// Store des visites
export const visitesStore = writable([]);

// Store des notifications
export const notificationsStore = writable([]);
export const notificationsNonLu = writable(0);

// Store des paiements
export const paiementsStore = writable([]);

// Store des vendeurs
export const vendeursStore = writable([]);

// Store des stats
export const statsStore = writable({});

// Fonctions de rafraîchissement
export async function refreshProperties(params = '') {
  propertiesLoading.set(true);
  const res = await fetch(`/api/properties?${params}`);
  const data = await res.json();
  propertiesStore.set(data.properties || []);
  propertiesLoading.set(false);
  return data;
}

export async function refreshVisites() {
  const res = await fetch('/api/visites');
  const data = await res.json();
  visitesStore.set(data.visites || []);
  return data;
}

export async function refreshNotifications() {
  const res = await fetch('/api/notifications');
  const data = await res.json();
  notificationsStore.set(data.notifications || []);
  notificationsNonLu.set(data.nonLu || 0);
  return data;
}

export async function refreshPaiements() {
  const res = await fetch('/api/paiements');
  const data = await res.json();
  paiementsStore.set(data.paiements || []);
  return data;
}

export async function refreshVendeurs() {
  const res = await fetch('/api/admin/vendeurs');
  const data = await res.json();
  vendeursStore.set(data.vendeurs || []);
  return data;
}

export async function refreshAllStats() {
  const [statsRes, notifRes, paiementRes, visiteRes] = await Promise.all([
    fetch('/api/admin/stats'),
    fetch('/api/notifications'),
    fetch('/api/paiements'),
    fetch('/api/visites')
  ]);

  const stats = (await statsRes.json()).stats || {};
  const notifs = await notifRes.json();
  const paiements = await paiementRes.json();
  const visites = await visiteRes.json();

  statsStore.set({
    ...stats,
    nonLu: notifs.nonLu || 0,
    nbVisites: visites.visites?.length || 0,
    totalPaiements: (paiements.paiements || []).reduce((s, p) => s + p.montant, 0),
    nbPaiements: (paiements.paiements || []).length
  });
}
