<script>
  import { onMount } from 'svelte';
  import PropertyCard from '$lib/components/PropertyCard.svelte';

  let featured = [];
  let loading = true;
  let total = 0;

  onMount(async () => {
    try {
      const res = await fetch('/api/properties?limit=6');
      if (res.ok) {
        const data = await res.json();
        featured = data.properties || [];
        total = data.pagination?.total || featured.length;
      }
    } catch (e) { console.error(e); }
    loading = false;
  });
</script>

<svelte:head>
  <title>SAS Immobilière - {total} biens disponibles</title>
</svelte:head>

<!-- Hero avec image Unsplash -->
<section class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <span class="hero-badge">🏠 {total} biens disponibles</span>
    <h1>Trouvez votre bien <span class="highlight">idéal</span> en Côte d'Ivoire</h1>
    <p>Maisons, appartements, terrains et locaux commerciaux à Abidjan et partout en Côte d'Ivoire.</p>
    <div class="hero-actions">
      <a href="/properties" class="btn-primary">🔍 Voir tous les biens</a>
      <a href="/properties?transaction=location" class="btn-secondary">🔑 Louer un bien</a>
    </div>
  </div>
</section>

<section class="how">
  <div class="container">
    <h2>🔍 Comment ça marche ?</h2>
    <div class="steps">
      <div class="step"><div class="step-icon">🔎</div><h3>1. Cherchez</h3><p>Parcourez les biens par ville, prix ou type</p></div>
      <div class="step"><div class="step-icon">📞</div><h3>2. Contactez</h3><p>Appelez le propriétaire ou l'agent</p></div>
      <div class="step"><div class="step-icon">🔑</div><h3>3. Visitez</h3><p>Planifiez une visite et finalisez</p></div>
    </div>
  </div>
</section>

<section class="featured">
  <div class="container">
    <div class="featured-header">
      <h2>🏠 Biens en vedette</h2>
      <a href="/properties" class="view-all">Voir tout →</a>
    </div>

    {#if loading}
      <p class="empty">⏳ Chargement...</p>
    {:else if featured.length > 0}
      <div class="grid">
        {#each featured as property}
          <PropertyCard {property} />
        {/each}
      </div>
    {:else}
      <p class="empty">Aucun bien disponible.</p>
    {/if}
  </div>
</section>

<style>
  .hero {
    position: relative;
    padding: 6rem 1.5rem;
    text-align: center;
    background: url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200') center/cover no-repeat;
    color: white;
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,80,50,0.6) 100%);
  }
  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 700px;
    margin: 0 auto;
  }
  .hero-badge {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    backdrop-filter: blur(10px);
    color: white;
    padding: 0.4rem 1rem;
    border-radius: 999px;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
  .hero h1 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0 0 1rem;
    line-height: 1.2;
  }
  .highlight { color: #34d399; }
  .hero p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0 0 2rem;
  }
  .hero-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    padding: 0.9rem 2rem;
    background: white;
    color: #065f46;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1rem;
    transition: all 0.2s;
  }
  .btn-primary:hover { transform: translateY(-2px); }
  .btn-secondary {
    padding: 0.9rem 2rem;
    background: transparent;
    color: white;
    border: 2px solid white;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1rem;
  }

  .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }
  .how { padding: 4rem 0; background: white; }
  .how h2 { text-align: center; font-size: 1.5rem; color: #1e293b; margin-bottom: 2rem; }
  .steps { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center; }
  .step-icon { font-size: 2.5rem; margin-bottom: 0.5rem; }
  .step h3 { color: #1e293b; margin: 0.5rem 0; }
  .step p { color: #64748b; font-size: 0.9rem; }

  .featured { padding: 3rem 0; }
  .featured-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
  .featured-header h2 { font-size: 1.5rem; color: #1e293b; margin: 0; }
  .view-all { color: #3b82f6; text-decoration: none; font-weight: 500; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
  .empty { text-align: center; color: #94a3b8; padding: 3rem; }

  @media (max-width: 768px) {
    .hero h1 { font-size: 1.8rem; }
    .grid { grid-template-columns: 1fr; }
  }
</style>
