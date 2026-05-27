<script>
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import PropertyCard from '$lib/components/PropertyCard.svelte';

  let properties = [];
  let loading = true;
  let total = 0;

  let ville = '';
  let type = '';
  let transaction = '';
  let prixMin = '';
  let prixMax = '';

  onMount(() => {
    const p = $page.url.searchParams;
    ville = p.get('ville') || '';
    type = p.get('type') || '';
    transaction = p.get('transaction') || '';
    loadProperties();
  });

  async function loadProperties() {
    loading = true;
    const p = new URLSearchParams();
    if (ville) p.set('ville', ville);
    if (type) p.set('type', type);
    if (transaction) p.set('transaction', transaction);
    p.set('limit', '50');
    try {
      const res = await fetch('/api/properties?' + p);
      const data = await res.json();
      properties = data.properties || [];
      total = data.pagination?.total || properties.length;
    } catch(e) { properties = []; }
    loading = false;
  }

  function reset() {
    ville = ''; type = ''; transaction = ''; prixMin = ''; prixMax = '';
    loadProperties();
  }

  const typeLabels = { residentiel: '🏠 Résidentiel', commercial: '🏪 Commercial', terrain: '🌍 Terrain', vehicule: '🚗 Véhicule' };
  const transLabels = { vente: '💰 Vente', location: '🔑 Location' };
</script>

<svelte:head>
  <title>Tous les biens — SAS Immobilière</title>
</svelte:head>

<!-- PAGE HERO -->
<section class="page-hero">
  <div class="ph-content">
    <h1>🏠 Nos biens immobiliers</h1>
    <p>Villas, appartements, terrains et locaux commerciaux en Côte d'Ivoire</p>
    <nav class="breadcrumb">
      <a href="/">Accueil</a><span>/</span><span>Biens</span>
    </nav>
  </div>
</section>

<div class="layout">
  <!-- SIDEBAR FILTRES -->
  <aside class="sidebar">
    <div class="filter-card">
      <div class="fc-head">
        <h3>🔍 Filtres</h3>
        <button class="reset-btn" on:click={reset}>Réinitialiser</button>
      </div>

      <div class="filter-group">
        <label for="f-ville">📍 Ville ou quartier</label>
        <input id="f-ville" type="text" bind:value={ville} placeholder="Ex: Cocody..." />
      </div>

      <div class="filter-group">
        <label for="f-trans">💼 Transaction</label>
        <select id="f-trans" bind:value={transaction}>
          <option value="">Toutes</option>
          <option value="vente">Vente</option>
          <option value="location">Location</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="f-type">🏠 Type de bien</label>
        <select id="f-type" bind:value={type}>
          <option value="">Tous</option>
          <option value="residentiel">Résidentiel</option>
          <option value="commercial">Commercial</option>
          <option value="terrain">Terrain</option>
          <option value="vehicule">Véhicule</option>
        </select>
      </div>

      <div class="filter-group">
        <label>💰 Budget (FCFA)</label>
        <div class="price-row">
          <input type="number" bind:value={prixMin} placeholder="Min" />
          <span>—</span>
          <input type="number" bind:value={prixMax} placeholder="Max" />
        </div>
      </div>

      <button class="apply-btn" on:click={loadProperties}>Appliquer les filtres</button>
    </div>

    <!-- TYPES RAPIDES -->
    <div class="filter-card quick-links">
      <h3>Recherches rapides</h3>
      <a href="/properties?transaction=vente">💰 Biens à vendre</a>
      <a href="/properties?transaction=location">🔑 Biens à louer</a>
      <a href="/properties?type=residentiel">🏠 Résidentiel</a>
      <a href="/properties?type=terrain">🌍 Terrains</a>
    </div>
  </aside>

  <!-- CONTENU PRINCIPAL -->
  <main class="content">
    <!-- FILTRES ACTIFS -->
    {#if ville || type || transaction}
      <div class="active-filters">
        <span class="af-label">Filtres actifs :</span>
        {#if ville}<span class="af-tag">📍 {ville} <button on:click={() => { ville = ''; loadProperties(); }}>×</button></span>{/if}
        {#if type}<span class="af-tag">{typeLabels[type] || type} <button on:click={() => { type = ''; loadProperties(); }}>×</button></span>{/if}
        {#if transaction}<span class="af-tag">{transLabels[transaction] || transaction} <button on:click={() => { transaction = ''; loadProperties(); }}>×</button></span>{/if}
      </div>
    {/if}

    <!-- RÉSULTATS -->
    <div class="results-head">
      <span class="results-count">
        {#if loading}Chargement...{:else}{total} bien{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}{/if}
      </span>
    </div>

    {#if loading}
      <div class="grid">
        {#each Array(9) as _}
          <div class="skele"><div class="s-img"></div><div class="s-line"></div><div class="s-line short"></div></div>
        {/each}
      </div>
    {:else if properties.length === 0}
      <div class="empty">
        <span>🔍</span>
        <h3>Aucun résultat</h3>
        <p>Essayez avec d'autres critères ou <button on:click={reset}>réinitialisez les filtres</button></p>
      </div>
    {:else}
      <div class="grid">
        {#each properties as property}
          <PropertyCard {property} />
        {/each}
      </div>
    {/if}
  </main>
</div>

<style>
  .page-hero {
    background: linear-gradient(135deg, #064e3b 0%, #059669 100%);
    padding: 3rem 1.5rem; color: white; text-align: center;
  }
  .ph-content h1 { font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
  .ph-content p { opacity: 0.85; margin-bottom: 1rem; }
  .breadcrumb { display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.85rem; opacity: 0.7; }
  .breadcrumb a { color: white; text-decoration: none; }
  .breadcrumb a:hover { text-decoration: underline; }

  .layout {
    max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem;
    display: grid; grid-template-columns: 280px 1fr; gap: 2rem; align-items: start;
  }

  /* SIDEBAR */
  .sidebar { display: flex; flex-direction: column; gap: 1.25rem; position: sticky; top: 88px; }
  .filter-card {
    background: white; border-radius: 16px; padding: 1.5rem;
    border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .fc-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; }
  .fc-head h3 { font-size: 1rem; font-weight: 700; color: #1e293b; }
  .reset-btn { background: none; border: none; color: #059669; font-size: 0.8rem; cursor: pointer; font-weight: 600; }
  .filter-group { margin-bottom: 1rem; }
  .filter-group label { display: block; font-size: 0.78rem; font-weight: 600; color: #64748b; margin-bottom: 0.4rem; }
  .filter-group input, .filter-group select {
    width: 100%; padding: 0.6rem 0.8rem; border: 1.5px solid #e2e8f0;
    border-radius: 10px; font-size: 0.9rem; color: #1e293b; background: #f8fafc;
    transition: border-color 0.15s;
  }
  .filter-group input:focus, .filter-group select:focus { outline: none; border-color: #059669; background: white; }
  .price-row { display: flex; align-items: center; gap: 0.5rem; }
  .price-row input { flex: 1; }
  .price-row span { color: #94a3b8; font-size: 0.8rem; }
  .apply-btn {
    width: 100%; padding: 0.75rem; background: #059669; color: white;
    border: none; border-radius: 10px; font-weight: 700; cursor: pointer;
    transition: background 0.15s; margin-top: 0.5rem;
  }
  .apply-btn:hover { background: #047857; }

  .quick-links h3 { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem; }
  .quick-links a {
    display: block; padding: 0.5rem 0; color: #475569; text-decoration: none;
    font-size: 0.85rem; border-bottom: 1px solid #f1f5f9; transition: color 0.15s;
  }
  .quick-links a:last-child { border-bottom: none; }
  .quick-links a:hover { color: #059669; }

  /* CONTENT */
  .content { min-width: 0; }
  .active-filters {
    display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;
    margin-bottom: 1rem; padding: 0.75rem 1rem;
    background: #f0fdf4; border-radius: 10px; border: 1px solid #bbf7d0;
  }
  .af-label { font-size: 0.8rem; font-weight: 600; color: #064e3b; }
  .af-tag {
    display: inline-flex; align-items: center; gap: 0.4rem;
    background: white; border: 1px solid #059669; color: #059669;
    padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.8rem; font-weight: 500;
  }
  .af-tag button { background: none; border: none; color: #059669; cursor: pointer; font-size: 0.9rem; padding: 0; }

  .results-head { margin-bottom: 1.25rem; }
  .results-count { font-size: 0.9rem; font-weight: 600; color: #64748b; }

  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 1.25rem; }

  /* SKELETON */
  .skele { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; }
  .s-img { height: 180px; background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%); background-size: 200% 100%; animation: sh 1.5s infinite; }
  .s-line { height: 12px; background: #e2e8f0; border-radius: 6px; margin: 12px; animation: sh 1.5s infinite; }
  .s-line.short { width: 50%; }
  @keyframes sh { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  .empty { text-align: center; padding: 5rem 2rem; color: #94a3b8; }
  .empty span { font-size: 3.5rem; display: block; margin-bottom: 1rem; }
  .empty h3 { color: #475569; font-size: 1.2rem; margin-bottom: 0.5rem; }
  .empty button { background: none; border: none; color: #059669; cursor: pointer; text-decoration: underline; font-size: inherit; }

  @media (max-width: 1024px) {
    .layout { grid-template-columns: 240px 1fr; }
  }
  @media (max-width: 768px) {
    .layout { grid-template-columns: 1fr; }
    .sidebar { position: static; }
  }
</style>
