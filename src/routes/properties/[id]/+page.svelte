<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let property = null;
  let loading = true;
  let showContact = false;
  let showVisite = false;
  let form = { nom: '', email: '', phone: '', message: '' };
  let visite = { nom: '', email: '', phone: '', date: '', heure: '10:00' };
  let formSent = false;
  let formError = '';
  let mapContainer;

  onMount(async () => {
    const res = await fetch(`/api/properties/${$page.params.id}`);
    if (res.ok) {
      const data = await res.json();
      property = data.property;
      if (browser && property) setTimeout(initMap, 300);
    }
    loading = false;
  });

  async function initMap() {
    try {
      const L = await import('leaflet');
      if (!mapContainer) return;
      const lat = property.coordonnees?.lat || 5.3600;
      const lng = property.coordonnees?.lng || -4.0083;
      const map = L.map(mapContainer).setView([lat, lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
      }).addTo(map);
      L.marker([lat, lng]).addTo(map)
        .bindPopup(`<b>${property.titre}</b><br>${property.prix?.toLocaleString()} FCFA`)
        .openPopup();
    } catch (e) {}
  }

  async function handleContact() {
    formError = '';
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bienId: $page.params.id, ...form })
    });
    if (res.ok) { formSent = true; showContact = false; }
    else { formError = (await res.json()).error; }
  }

  async function handleVisite() {
    formError = '';
    const res = await fetch('/api/visites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bienId: $page.params.id, ...visite })
    });
    if (res.ok) { formSent = true; showVisite = false; }
    else { formError = (await res.json()).error; }
  }
</script>

<svelte:head>
  <title>{property?.titre || 'Bien'} - SAS Immobilière</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

{#if loading}
  <div class="loading">⏳ Chargement...</div>
{:else if property}
  <div class="detail-page">
    <a href="/properties" class="back">← Retour aux biens</a>

    <div class="top-section">
      <div class="gallery">
        {#if property.photos?.[0]}
          <img src={property.photos[0]} alt={property.titre} />
        {:else}
          <div class="placeholder">🏠</div>
        {/if}
      </div>

      <div class="infos">
        <span class="badge">{property.transaction === 'vente' ? 'À vendre' : 'À louer'}</span>
        <h1>{property.titre || 'Bien'}</h1>
        <p class="prix">{property.prix?.toLocaleString()} FCFA{property.transaction === 'location' ? '/mois' : ''}</p>
        <p class="localisation">📍 {property.ville}, {property.quartier}</p>
        <p class="description">{property.description}</p>

        <div class="carac">
          {#if property.surface}<span>📏 {property.surface} m²</span>{/if}
          {#if property.pieces > 0}<span>🚪 {property.pieces} pièces</span>{/if}
          {#if property.chambres > 0}<span>🛏️ {property.chambres} chambres</span>{/if}
          {#if property.douches > 0}<span>🚿 {property.douches} douches</span>{/if}
        </div>

        {#if property.proprietaire}
          <div class="proprio">
            <div class="avatar">{property.proprietaire.prenom?.[0]}{property.proprietaire.nom?.[0]}</div>
            <div>
              <strong>{property.proprietaire.prenom} {property.proprietaire.nom}</strong>
              <p>📞 {property.proprietaire.phone}</p>
            </div>
          </div>
        {/if}

        <div class="actions">
          <button class="btn-contact" on:click={() => { showContact = !showContact; showVisite = false; }}>
            📞 Contacter
          </button>
          <button class="btn-visite" on:click={() => { showVisite = !showVisite; showContact = false; }}>
            📅 Demander une visite
          </button>
        </div>

        {#if formSent}
          <div class="success">✅ Votre demande a été envoyée !</div>
        {/if}

        {#if showContact}
          <div class="form-box">
            <h3>📞 Contacter le propriétaire</h3>
            {#if formError}<p class="error">{formError}</p>{/if}
            <input type="text" bind:value={form.nom} placeholder="Votre nom" />
            <input type="email" bind:value={form.email} placeholder="Votre email" />
            <input type="tel" bind:value={form.phone} placeholder="Votre téléphone" />
            <textarea bind:value={form.message} placeholder="Votre message..." rows="3"></textarea>
            <button on:click={handleContact}>Envoyer</button>
          </div>
        {/if}

        {#if showVisite}
          <div class="form-box">
            <h3>📅 Demander une visite</h3>
            {#if formError}<p class="error">{formError}</p>{/if}
            <input type="text" bind:value={visite.nom} placeholder="Votre nom" />
            <input type="email" bind:value={visite.email} placeholder="Votre email" />
            <input type="tel" bind:value={visite.phone} placeholder="Votre téléphone" />
            <input type="date" bind:value={visite.date} />
            <input type="time" bind:value={visite.heure} />
            <textarea bind:value={visite.message} placeholder="Message (optionnel)" rows="2"></textarea>
            <button on:click={handleVisite}>Demander la visite</button>
          </div>
        {/if}
      </div>
    </div>

    <div class="map-section">
      <h2>📍 Localisation</h2>
      <div bind:this={mapContainer} class="map-container"></div>
    </div>
  </div>
{/if}

<style>
  .loading { text-align: center; padding: 3rem; }
  .back { color: #3b82f6; text-decoration: none; margin-bottom: 1rem; display: inline-block; }
  .detail-page { max-width: 1000px; margin: 0 auto; padding: 1.5rem; }
  .top-section { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
  .gallery { background: #f1f5f9; border-radius: 16px; overflow: hidden; min-height: 300px; display: flex; align-items: center; justify-content: center; }
  .gallery img { width: 100%; height: 100%; object-fit: cover; min-height: 300px; }
  .placeholder { font-size: 5rem; }
  .badge { background: #059669; color: white; padding: 0.3rem 0.8rem; border-radius: 999px; font-size: 0.8rem; font-weight: 600; display: inline-block; }
  h1 { font-size: 1.5rem; color: #1e293b; margin: 0.5rem 0; }
  .prix { font-size: 1.8rem; font-weight: 700; color: #059669; }
  .localisation { color: #64748b; }
  .description { color: #475569; line-height: 1.7; margin: 1rem 0; }
  .carac { display: flex; gap: 0.75rem; flex-wrap: wrap; margin: 1rem 0; }
  .carac span { background: #f1f5f9; padding: 0.4rem 0.8rem; border-radius: 8px; }
  .proprio { display: flex; align-items: center; gap: 0.75rem; margin: 1rem 0; padding: 1rem; background: #f8fafc; border-radius: 12px; }
  .avatar { width: 40px; height: 40px; background: #d1fae5; color: #065f46; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; }
  .actions { display: flex; gap: 0.75rem; margin: 1rem 0; flex-wrap: wrap; }
  .btn-contact, .btn-visite { padding: 0.75rem 1rem; border: none; border-radius: 12px; font-size: 0.95rem; cursor: pointer; font-weight: 600; flex: 1; min-width: 140px; }
  .btn-contact { background: #059669; color: white; }
  .btn-visite { background: #3b82f6; color: white; }
  .form-box { background: #f8fafc; padding: 1.5rem; border-radius: 12px; display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
  .form-box input, .form-box textarea { padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; width: 100%; box-sizing: border-box; }
  .form-box button { padding: 0.75rem; background: #059669; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
  .success { background: #d1fae5; color: #065f46; padding: 1rem; border-radius: 12px; text-align: center; margin-top: 1rem; }
  .error { color: #ef4444; }
  .map-section { margin-top: 2rem; }
  .map-section h2 { margin-bottom: 0.75rem; }
  .map-container { width: 100%; height: 400px; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; }
  @media (max-width: 768px) { .top-section { grid-template-columns: 1fr; } .map-container { height: 300px; } }
</style>
