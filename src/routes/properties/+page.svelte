<script>
  import { onMount } from 'svelte';
  import PropertyCard from '$lib/components/PropertyCard.svelte';

  let properties = [];
  let loading = true;
  let total = 0;
  let search = '';
  let type = '';
  let transaction = '';

  onMount(() => { loadProperties(); });

  async function loadProperties() {
    loading = true;
    const params = new URLSearchParams();
    if (search) params.set('ville', search);
    if (type) params.set('type', type);
    if (transaction) params.set('transaction', transaction);

    const res = await fetch(`/api/properties?limit=50&${params}`);
    const data = await res.json();
    properties = data.properties || [];
    total = data.pagination?.total || properties.length;
    loading = false;
  }
</script>

<svelte:head>
  <title>Tous les biens - SAS Immobilière</title>
</svelte:head>

<div class="container">
  <h1>🏠 Tous les biens</h1>

  <!-- Filtres -->
  <div class="filters">
    <input type="text" bind:value={search} placeholder="Ville..." />
    <select bind:value={type}>
      <option value="">Tous types</option>
      <option value="residentiel">Résidentiel</option>
      <option value="commercial">Commercial</option>
      <option value="terrain">Terrain</option>
      <option value="vehicule">Véhicule</option>
    </select>
    <select bind:value={transaction}>
      <option value="">Toutes transactions</option>
      <option value="vente">Vente</option>
      <option value="location">Location</option>
    </select>
    <button on:click={loadProperties}>Rechercher</button>
  </div>

  {#if loading}
    <p class="empty">⏳ Chargement...</p>
  {:else if properties.length === 0}
    <p class="empty">Aucun bien trouvé.</p>
  {:else}
    <p class="count">{properties.length} bien{properties.length > 1 ? 's' : ''}</p>
    <div class="grid">
      {#each properties as property}
        <PropertyCard {property} />
      {/each}
    </div>
  {/if}
</div>

<style>
  .container { max-width: 1200px; margin: 0 auto; padding: 2rem 1.5rem; }
  h1 { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0 0 1.5rem; }

  .filters { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
  .filters input, .filters select {
    padding: 0.6rem 1rem; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem;
  }
  .filters button {
    padding: 0.6rem 1.2rem; background: #059669; color: white; border: none;
    border-radius: 8px; cursor: pointer; font-weight: 600;
  }

  .count { font-size: 0.9rem; color: #64748b; margin-bottom: 1rem; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
  .empty { text-align: center; color: #94a3b8; padding: 3rem; }
</style>
