<script>
  import { onMount } from 'svelte';
  import PropertyCard from '$lib/components/PropertyCard.svelte';

  let properties = [];
  let loading = true;
  let searchVille = '';
  let searchTransaction = '';
  let searchType = '';

  onMount(async () => {
    try {
      const res = await fetch('/api/properties?limit=6');
      const data = await res.json();
      properties = data.properties || [];
    } catch(e) { properties = []; }
    loading = false;
  });

  function handleSearch() {
    const p = new URLSearchParams();
    if (searchVille) p.set('ville', searchVille);
    if (searchTransaction) p.set('transaction', searchTransaction);
    if (searchType) p.set('type', searchType);
    window.location.href = '/properties?' + p.toString();
  }
</script>

<svelte:head>
  <title>SAS Immobilière — Trouvez votre bien idéal en Côte d'Ivoire</title>
</svelte:head>

<!-- HERO -->
<section class="hero">
  <div class="hero-bg"></div>
  <div class="hero-body">
    <div class="hero-text">
      <span class="badge">🏆 N°1 de l'immobilier en Côte d'Ivoire</span>
      <h1>Trouvez le bien<br/>de vos <em>rêves</em></h1>
      <p>Des milliers de villas, appartements et terrains à Abidjan et dans tout le pays.</p>
    </div>

    <div class="search-box">
      <h3>Rechercher un bien</h3>
      <div class="search-fields">
        <div class="sf">
          <label for="ville">📍 Ville ou quartier</label>
          <input id="ville" type="text" bind:value={searchVille} placeholder="Ex: Cocody, Plateau..." />
        </div>
        <div class="sf">
          <label for="trans">🏷️ Transaction</label>
          <select id="trans" bind:value={searchTransaction}>
            <option value="">Acheter ou louer</option>
            <option value="vente">Acheter</option>
            <option value="location">Louer</option>
          </select>
        </div>
        <div class="sf">
          <label for="type">🏠 Type</label>
          <select id="type" bind:value={searchType}>
            <option value="">Tous types</option>
            <option value="residentiel">Résidentiel</option>
            <option value="commercial">Commercial</option>
            <option value="terrain">Terrain</option>
          </select>
        </div>
      </div>
      <button class="search-btn" on:click={handleSearch}>🔍 Rechercher</button>
    </div>
  </div>

  <div class="hero-stats">
    <div class="stat"><strong>500+</strong><span>Biens disponibles</span></div>
    <div class="vline"></div>
    <div class="stat"><strong>200+</strong><span>Clients satisfaits</span></div>
    <div class="vline"></div>
    <div class="stat"><strong>10+</strong><span>Années d'expérience</span></div>
    <div class="vline"></div>
    <div class="stat"><strong>15+</strong><span>Villes couvertes</span></div>
  </div>
</section>

<!-- CATÉGORIES -->
<section class="section bg-white">
  <div class="container">
    <div class="sec-head">
      <div>
        <h2>Parcourir par catégorie</h2>
        <p>Trouvez le type de bien qui vous correspond</p>
      </div>
    </div>
    <div class="cat-grid">
      <a href="/properties?type=residentiel&transaction=vente" class="cat">
        <div class="cat-img" style="background:linear-gradient(135deg,#dbeafe,#bfdbfe)">🏠</div>
        <strong>Villa / Appartement</strong>
        <span>À vendre</span>
      </a>
      <a href="/properties?type=residentiel&transaction=location" class="cat">
        <div class="cat-img" style="background:linear-gradient(135deg,#d1fae5,#a7f3d0)">🔑</div>
        <strong>Location</strong>
        <span>Résidentiel</span>
      </a>
      <a href="/properties?type=commercial" class="cat">
        <div class="cat-img" style="background:linear-gradient(135deg,#fef3c7,#fde68a)">🏪</div>
        <strong>Commercial</strong>
        <span>Bureaux & Commerces</span>
      </a>
      <a href="/properties?type=terrain" class="cat">
        <div class="cat-img" style="background:linear-gradient(135deg,#dcfce7,#bbf7d0)">🌍</div>
        <strong>Terrain</strong>
        <span>Parcelles & Lots</span>
      </a>
    </div>
  </div>
</section>

<!-- BIENS EN VEDETTE -->
<section class="section bg-gray">
  <div class="container">
    <div class="sec-head">
      <div>
        <h2>Biens en vedette</h2>
        <p>Les meilleures opportunités du moment</p>
      </div>
      <a href="/properties" class="link-more">Voir tous les biens →</a>
    </div>

    {#if loading}
      <div class="skele-grid">
        {#each Array(6) as _}
          <div class="skele-card">
            <div class="skele-img"></div>
            <div class="skele-line"></div>
            <div class="skele-line short"></div>
          </div>
        {/each}
      </div>
    {:else if properties.length === 0}
      <div class="empty">
        <span>🏡</span>
        <p>Aucun bien disponible pour le moment</p>
        <a href="/contact">Nous contacter</a>
      </div>
    {:else}
      <div class="prop-grid">
        {#each properties as p}
          <PropertyCard property={p} />
        {/each}
      </div>
    {/if}
  </div>
</section>

<!-- POURQUOI NOUS -->
<section class="section bg-white">
  <div class="container">
    <div class="sec-head center">
      <div>
        <h2>Pourquoi nous choisir ?</h2>
        <p>Des milliers de familles nous font confiance</p>
      </div>
    </div>
    <div class="why-grid">
      <div class="why">
        <div class="why-ico" style="background:#dbeafe">✅</div>
        <h3>Biens vérifiés</h3>
        <p>Chaque bien est visité et vérifié par notre équipe avant publication.</p>
      </div>
      <div class="why">
        <div class="why-ico" style="background:#d1fae5">🤝</div>
        <h3>Accompagnement total</h3>
        <p>Nos agents vous guident de la recherche jusqu'à la signature du contrat.</p>
      </div>
      <div class="why">
        <div class="why-ico" style="background:#fef3c7">💰</div>
        <h3>Meilleurs prix</h3>
        <p>Nous négocions pour vous les meilleures offres du marché ivoirien.</p>
      </div>
      <div class="why">
        <div class="why-ico" style="background:#fce7f3">⚡</div>
        <h3>Réponse rapide</h3>
        <p>Notre équipe répond à toutes vos demandes en moins de 24 heures.</p>
      </div>
    </div>
  </div>
</section>

<!-- VILLES -->
<section class="section bg-gray">
  <div class="container">
    <div class="sec-head center">
      <div>
        <h2>Nos zones d'intervention</h2>
        <p>Présents dans toutes les grandes villes de Côte d'Ivoire</p>
      </div>
    </div>
    <div class="cities">
      {#each ['Abidjan','Cocody','Plateau','Marcory','Yopougon','Bingerville','San-Pédro','Bouaké'] as city}
        <a href="/properties?ville={city}" class="city-pill">📍 {city}</a>
      {/each}
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta-section">
  <div class="container">
    <div class="cta-box">
      <div class="cta-left">
        <h2>Vous avez un bien à vendre ou à louer ?</h2>
        <p>Publiez votre annonce et touchez des milliers d'acheteurs potentiels.</p>
      </div>
      <div class="cta-btns">
        <a href="/register" class="cta-btn-w">Créer un compte gratuit</a>
        <a href="/contact" class="cta-btn-o">Nous contacter</a>
      </div>
    </div>
  </div>
</section>

<style>
  /* HERO */
  .hero {
    background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80') center/cover no-repeat;
    position: relative; color: white; min-height: 85vh;
    display: flex; flex-direction: column;
  }
  .hero-bg {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(15,23,42,0.88) 0%, rgba(5,150,105,0.55) 100%);
  }
  .hero-body {
    position: relative; z-index: 1; flex: 1;
    max-width: 1280px; margin: 0 auto; padding: 5rem 1.5rem 3rem;
    display: flex; align-items: center; gap: 4rem; flex-wrap: wrap;
  }
  .hero-text { flex: 1; min-width: 300px; }
  .badge {
    display: inline-block; background: rgba(5,150,105,0.85);
    padding: 0.35rem 1rem; border-radius: 999px;
    font-size: 0.8rem; font-weight: 600; margin-bottom: 1.5rem;
  }
  .hero-text h1 {
    font-size: clamp(2.5rem, 5vw, 3.8rem);
    font-weight: 900; line-height: 1.1; margin-bottom: 1rem;
  }
  .hero-text h1 em { color: #34d399; font-style: normal; }
  .hero-text p { font-size: 1.05rem; opacity: 0.85; max-width: 480px; line-height: 1.6; }

  /* SEARCH BOX */
  .search-box {
    background: white; border-radius: 20px;
    padding: 1.75rem; width: 400px; flex-shrink: 0;
    box-shadow: 0 25px 60px rgba(0,0,0,0.35);
    color: #1e293b;
  }
  .search-box h3 { font-size: 1.1rem; font-weight: 700; margin-bottom: 1.25rem; color: #1e293b; }
  .search-fields { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
  .sf { display: flex; flex-direction: column; gap: 0.3rem; }
  .sf label { font-size: 0.78rem; font-weight: 600; color: #64748b; }
  .sf input, .sf select {
    padding: 0.65rem 0.9rem; border: 1.5px solid #e2e8f0;
    border-radius: 10px; font-size: 0.9rem; color: #1e293b;
    transition: border-color 0.15s; background: #f8fafc;
  }
  .sf input:focus, .sf select:focus { outline: none; border-color: #059669; background: white; }
  .search-btn {
    width: 100%; padding: 0.85rem;
    background: #059669; color: white; border: none;
    border-radius: 12px; font-size: 1rem; font-weight: 700;
    cursor: pointer; transition: background 0.15s;
  }
  .search-btn:hover { background: #047857; }

  /* STATS */
  .hero-stats {
    position: relative; z-index: 1;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(10px);
    border-top: 1px solid rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    padding: 1.5rem; gap: 3rem; flex-wrap: wrap;
  }
  .stat { text-align: center; }
  .stat strong { display: block; font-size: 2rem; font-weight: 800; color: #34d399; }
  .stat span { font-size: 0.8rem; opacity: 0.8; }
  .vline { width: 1px; height: 40px; background: rgba(255,255,255,0.15); }

  /* SECTIONS */
  .section { padding: 5rem 0; }
  .bg-white { background: white; }
  .bg-gray { background: #f8fafc; }
  .container { max-width: 1280px; margin: 0 auto; padding: 0 1.5rem; }
  .sec-head {
    display: flex; align-items: flex-end;
    justify-content: space-between; margin-bottom: 2.5rem;
  }
  .sec-head.center { justify-content: center; text-align: center; }
  .sec-head h2 { font-size: 1.9rem; font-weight: 800; color: #1e293b; margin-bottom: 0.3rem; }
  .sec-head p { color: #64748b; }
  .link-more { color: #059669; text-decoration: none; font-weight: 600; font-size: 0.9rem; white-space: nowrap; }

  /* CATEGORIES */
  .cat-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
  .cat {
    border-radius: 16px; background: #f8fafc; border: 2px solid #e2e8f0;
    text-decoration: none; color: #1e293b; overflow: hidden;
    transition: all 0.2s; text-align: center;
  }
  .cat:hover { border-color: #059669; transform: translateY(-4px); box-shadow: 0 12px 30px rgba(5,150,105,0.15); }
  .cat-img { font-size: 3rem; padding: 2rem; display: flex; align-items: center; justify-content: center; }
  .cat strong { display: block; font-weight: 700; padding: 0 1rem 0.3rem; }
  .cat span { display: block; font-size: 0.8rem; color: #64748b; padding: 0 1rem 1.5rem; }

  /* PROPERTIES GRID */
  .prop-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1.5rem; }

  /* SKELETONS */
  .skele-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px,1fr)); gap: 1.5rem; }
  .skele-card { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; }
  .skele-img { height: 200px; background: linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%); background-size: 200% 100%; animation: sh 1.5s infinite; }
  .skele-line { height: 14px; background: #e2e8f0; border-radius: 8px; margin: 14px; animation: sh 1.5s infinite; }
  .skele-line.short { width: 55%; }
  @keyframes sh { 0%{background-position:-200% 0} 100%{background-position:200% 0} }

  /* EMPTY */
  .empty { text-align: center; padding: 5rem; color: #94a3b8; }
  .empty span { font-size: 4rem; display: block; margin-bottom: 1rem; }
  .empty p { margin-bottom: 1rem; }
  .empty a { color: #059669; font-weight: 600; text-decoration: none; }

  /* WHY */
  .why-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1.5rem; }
  .why { padding: 2rem; border-radius: 16px; border: 1px solid #e2e8f0; background: #f8fafc; transition: all 0.2s; }
  .why:hover { border-color: #059669; box-shadow: 0 8px 24px rgba(5,150,105,0.1); transform: translateY(-2px); }
  .why-ico { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 1rem; }
  .why h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 0.5rem; }
  .why p { font-size: 0.85rem; color: #64748b; line-height: 1.6; }

  /* CITIES */
  .cities { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
  .city-pill {
    padding: 0.6rem 1.2rem; background: white; border: 1.5px solid #e2e8f0;
    border-radius: 999px; text-decoration: none; color: #475569;
    font-size: 0.9rem; font-weight: 500; transition: all 0.15s;
  }
  .city-pill:hover { border-color: #059669; color: #059669; background: #f0fdf4; }

  /* CTA */
  .cta-section { padding: 4rem 0; background: white; }
  .cta-box {
    background: linear-gradient(135deg, #064e3b, #059669);
    border-radius: 20px; padding: 3rem;
    display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap;
  }
  .cta-left h2 { color: white; font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem; }
  .cta-left p { color: rgba(255,255,255,0.8); }
  .cta-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
  .cta-btn-w {
    padding: 0.85rem 1.75rem; background: white; color: #059669;
    border-radius: 12px; text-decoration: none; font-weight: 700;
    transition: all 0.15s; white-space: nowrap;
  }
  .cta-btn-w:hover { background: #f0fdf4; }
  .cta-btn-o {
    padding: 0.85rem 1.75rem; border: 2px solid rgba(255,255,255,0.5); color: white;
    border-radius: 12px; text-decoration: none; font-weight: 700;
    transition: all 0.15s; white-space: nowrap;
  }
  .cta-btn-o:hover { background: rgba(255,255,255,0.1); }

  @media (max-width: 1024px) {
    .cat-grid { grid-template-columns: repeat(2,1fr); }
    .why-grid { grid-template-columns: repeat(2,1fr); }
  }
  @media (max-width: 768px) {
    .hero-body { flex-direction: column; padding: 3rem 1.5rem 2rem; }
    .search-box { width: 100%; }
    .hero-stats { gap: 1.5rem; }
    .vline { display: none; }
    .cat-grid { grid-template-columns: repeat(2,1fr); }
    .why-grid { grid-template-columns: 1fr; }
    .cta-box { flex-direction: column; text-align: center; }
    .cta-btns { width: 100%; justify-content: center; }
    .sec-head { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  }
</style>
