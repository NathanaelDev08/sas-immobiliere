<script>
  import { onMount } from 'svelte';
  import PropertyCard from '$lib/components/PropertyCard.svelte';

  let featuredProperties = [];
  let loading = true;
  let searchVille = '';
  let searchTransaction = '';

  onMount(async () => {
    try {
      const res = await fetch('/api/properties?limit=6');
      const data = await res.json();
      featuredProperties = data.properties || [];
    } catch(e) {
      featuredProperties = [];
    }
    loading = false;
  });

  function handleSearch() {
    const params = new URLSearchParams();
    if (searchVille) params.set('ville', searchVille);
    if (searchTransaction) params.set('transaction', searchTransaction);
    window.location.href = '/properties?' + params.toString();
  }
</script>

<svelte:head>
  <title>SAS Immobilière - Trouvez votre bien idéal en Côte d'Ivoire</title>
  <meta name="description" content="Achetez, vendez ou louez des biens immobiliers en Côte d'Ivoire. Villas, appartements, terrains à Abidjan et partout en Côte d'Ivoire." />
</svelte:head>

<!-- HERO -->
<section class="hero">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <span class="hero-badge">N°1 de l'immobilier en Côte d'Ivoire</span>
    <h1>Trouvez le bien<br/>de vos <span class="highlight">rêves</span></h1>
    <p>Des milliers de villas, appartements et terrains à Abidjan et dans tout le pays</p>

    <!-- Barre de recherche -->
    <div class="search-bar">
      <div class="search-field">
        <span class="search-icon">📍</span>
        <input
          type="text"
          bind:value={searchVille}
          placeholder="Ville ou quartier..."
          on:keydown={(e) => e.key === 'Enter' && handleSearch()}
        />
      </div>
      <div class="search-divider"></div>
      <div class="search-field">
        <span class="search-icon">🏷️</span>
        <select bind:value={searchTransaction}>
          <option value="">Acheter ou louer</option>
          <option value="vente">Acheter</option>
          <option value="location">Louer</option>
        </select>
      </div>
      <button class="search-btn" on:click={handleSearch}>
        🔍 Rechercher
      </button>
    </div>

    <!-- Stats rapides -->
    <div class="hero-stats">
      <div class="stat"><strong>500+</strong><span>Biens disponibles</span></div>
      <div class="stat-divider"></div>
      <div class="stat"><strong>200+</strong><span>Clients satisfaits</span></div>
      <div class="stat-divider"></div>
      <div class="stat"><strong>10+</strong><span>Années d'expérience</span></div>
    </div>
  </div>
</section>

<!-- CATÉGORIES -->
<section class="categories">
  <div class="container">
    <h2 class="section-title">Parcourir par catégorie</h2>
    <div class="categories-grid">
      <a href="/properties?type=residentiel" class="category-card">
        <span class="cat-icon">🏠</span>
        <strong>Résidentiel</strong>
        <span>Villas & Appartements</span>
      </a>
      <a href="/properties?type=commercial" class="category-card">
        <span class="cat-icon">🏪</span>
        <strong>Commercial</strong>
        <span>Bureaux & Commerces</span>
      </a>
      <a href="/properties?type=terrain" class="category-card">
        <span class="cat-icon">🌍</span>
        <strong>Terrain</strong>
        <span>Parcelles & Lots</span>
      </a>
      <a href="/properties?transaction=location" class="category-card">
        <span class="cat-icon">🔑</span>
        <strong>Location</strong>
        <span>Maisons & Apparts</span>
      </a>
    </div>
  </div>
</section>

<!-- BIENS EN VEDETTE -->
<section class="featured">
  <div class="container">
    <div class="section-header">
      <div>
        <h2 class="section-title">Biens en vedette</h2>
        <p class="section-sub">Les meilleures opportunités du moment</p>
      </div>
      <a href="/properties" class="see-all">Voir tout →</a>
    </div>

    {#if loading}
      <div class="loading-grid">
        {#each Array(6) as _}
          <div class="skeleton-card">
            <div class="skeleton-photo"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        {/each}
      </div>
    {:else if featuredProperties.length === 0}
      <div class="empty-state">
        <span>🏡</span>
        <p>Les biens arrivent bientôt</p>
        <a href="/contact" class="btn-outline">Nous contacter</a>
      </div>
    {:else}
      <div class="properties-grid">
        {#each featuredProperties as property}
          <PropertyCard {property} />
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- POURQUOI NOUS CHOISIR -->
<section class="why-us">
  <div class="container">
    <h2 class="section-title center">Pourquoi nous choisir ?</h2>
    <div class="why-grid">
      <div class="why-card">
        <span class="why-icon">✅</span>
        <h3>Biens vérifiés</h3>
        <p>Tous nos biens sont vérifiés et documentés pour votre sécurité.</p>
      </div>
      <div class="why-card">
        <span class="why-icon">🤝</span>
        <h3>Accompagnement complet</h3>
        <p>Nos agents vous accompagnent de la recherche à la signature.</p>
      </div>
      <div class="why-card">
        <span class="why-icon">💰</span>
        <h3>Meilleurs prix</h3>
        <p>Nous négocions les meilleurs prix pour vous sur le marché ivoirien.</p>
      </div>
      <div class="why-card">
        <span class="why-icon">⚡</span>
        <h3>Réponse rapide</h3>
        <p>Notre équipe répond à toutes vos demandes en moins de 24h.</p>
      </div>
    </div>
  </div>
</section>

<!-- CTA FINAL -->
<section class="cta">
  <div class="container">
    <div class="cta-card">
      <div class="cta-text">
        <h2>Vous avez un bien à vendre ou louer ?</h2>
        <p>Publiez votre annonce gratuitement et touchez des milliers d'acheteurs.</p>
      </div>
      <div class="cta-actions">
        <a href="/contact" class="btn-white">Nous contacter</a>
        <a href="/register" class="btn-outline-white">Créer un compte</a>
      </div>
    </div>
  </div>
</section>

<style>
  /* HERO */
  .hero {
    position: relative;
    min-height: 90vh;
    display: flex;
    align-items: center;
    background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80') center/cover no-repeat;
    color: white;
    padding: 2rem 1.5rem;
  }
  .hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(15,23,42,0.85) 0%, rgba(5,150,105,0.5) 100%);
  }
  .hero-content {
    position: relative;
    z-index: 1;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }
  .hero-badge {
    display: inline-block;
    background: rgba(5,150,105,0.9);
    padding: 0.4rem 1rem;
    border-radius: 999px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    margin-bottom: 1.5rem;
  }
  .hero-content h1 {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 1rem;
  }
  .highlight { color: #34d399; }
  .hero-content p {
    font-size: 1.1rem;
    opacity: 0.85;
    margin: 0 0 2rem;
  }

  /* SEARCH BAR */
  .search-bar {
    display: flex;
    align-items: center;
    background: white;
    border-radius: 16px;
    padding: 0.5rem;
    gap: 0;
    margin-bottom: 2rem;
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .search-field {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    flex: 1;
  }
  .search-icon { font-size: 1.1rem; }
  .search-field input, .search-field select {
    border: none;
    outline: none;
    font-size: 0.95rem;
    color: #1e293b;
    background: transparent;
    width: 100%;
  }
  .search-divider { width: 1px; height: 30px; background: #e2e8f0; }
  .search-btn {
    background: #059669;
    color: white;
    border: none;
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    font-weight: 700;
    font-size: 0.95rem;
    cursor: pointer;
    white-space: nowrap;
    transition: background 0.2s;
  }
  .search-btn:hover { background: #047857; }

  /* HERO STATS */
  .hero-stats {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
  }
  .stat { text-align: center; }
  .stat strong { display: block; font-size: 1.8rem; font-weight: 800; color: #34d399; }
  .stat span { font-size: 0.8rem; opacity: 0.8; }
  .stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.2); }

  /* CONTAINER */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 1.5rem; }

  /* SECTIONS */
  .section-title { font-size: 1.8rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem; }
  .section-title.center { text-align: center; }
  .section-sub { color: #64748b; margin: 0; }
  .section-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2rem; }
  .see-all { color: #059669; text-decoration: none; font-weight: 600; font-size: 0.9rem; }

  /* CATEGORIES */
  .categories { padding: 4rem 0; background: white; }
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .category-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 2rem 1rem;
    background: #f8fafc;
    border-radius: 16px;
    text-decoration: none;
    color: #1e293b;
    border: 2px solid transparent;
    transition: all 0.2s;
    text-align: center;
  }
  .category-card:hover { border-color: #059669; background: #f0fdf4; transform: translateY(-4px); }
  .cat-icon { font-size: 2.5rem; }
  .category-card strong { font-size: 1rem; font-weight: 700; }
  .category-card span { font-size: 0.8rem; color: #64748b; }

  /* FEATURED */
  .featured { padding: 4rem 0; background: #f8fafc; }
  .properties-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }

  /* SKELETONS */
  .loading-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
  }
  .skeleton-card { background: white; border-radius: 12px; overflow: hidden; }
  .skeleton-photo {
    height: 200px;
    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
  .skeleton-line {
    height: 14px;
    background: #e2e8f0;
    border-radius: 8px;
    margin: 12px;
    animation: shimmer 1.5s infinite;
  }
  .skeleton-line.short { width: 60%; }
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  /* EMPTY STATE */
  .empty-state {
    text-align: center;
    padding: 4rem;
    color: #94a3b8;
  }
  .empty-state span { font-size: 4rem; display: block; margin-bottom: 1rem; }
  .btn-outline {
    display: inline-block;
    margin-top: 1rem;
    padding: 0.7rem 1.5rem;
    border: 2px solid #059669;
    color: #059669;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 600;
  }

  /* WHY US */
  .why-us { padding: 4rem 0; background: white; }
  .why-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
  .why-card {
    padding: 2rem;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    transition: all 0.2s;
  }
  .why-card:hover { border-color: #059669; box-shadow: 0 8px 24px rgba(5,150,105,0.1); }
  .why-icon { font-size: 2rem; display: block; margin-bottom: 1rem; }
  .why-card h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0 0 0.5rem; }
  .why-card p { font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.6; }

  /* CTA */
  .cta { padding: 4rem 0; background: #f8fafc; }
  .cta-card {
    background: linear-gradient(135deg, #059669, #0284c7);
    border-radius: 20px;
    padding: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    flex-wrap: wrap;
  }
  .cta-text h2 { color: white; font-size: 1.5rem; margin: 0 0 0.5rem; }
  .cta-text p { color: rgba(255,255,255,0.85); margin: 0; }
  .cta-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .btn-white {
    padding: 0.8rem 1.5rem;
    background: white;
    color: #059669;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
  }
  .btn-outline-white {
    padding: 0.8rem 1.5rem;
    border: 2px solid white;
    color: white;
    border-radius: 10px;
    text-decoration: none;
    font-weight: 700;
  }

  @media (max-width: 768px) {
    .search-bar { flex-direction: column; gap: 0.5rem; }
    .search-divider { display: none; }
    .search-btn { width: 100%; }
    .hero-stats { gap: 1rem; }
    .section-header { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
    .cta-card { flex-direction: column; text-align: center; }
  }
</style>
