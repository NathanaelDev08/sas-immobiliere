<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let property = null;
  let loading = true;
  let currentPhoto = 0;
  let contactForm = { nom: '', phone: '', message: '' };
  let contactSent = false;

  onMount(async () => {
    const res = await fetch('/api/properties/' + $page.params.id);
    if (res.ok) property = (await res.json()).property;
    loading = false;
  });

  $: photos = property?.photos?.length ? property.photos : [];
  $: typeEmojis = { residentiel: '🏠', commercial: '🏪', terrain: '🌍', vehicule: '🚗' };
  $: typeLabel = { residentiel: 'Résidentiel', commercial: 'Commercial', terrain: 'Terrain', vehicule: 'Véhicule' };

  async function sendContact() {
    await fetch('/api/contact-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...contactForm, sujet: 'Demande info bien', propertyId: property._id })
    });
    contactSent = true;
  }
</script>

<svelte:head>
  <title>{property?.titre || 'Détail du bien'} — SAS Immobilière</title>
</svelte:head>

{#if loading}
  <div class="loading-page">
    <div class="spinner"></div>
    <p>Chargement du bien...</p>
  </div>
{:else if !property}
  <div class="not-found">
    <span>🏚️</span>
    <h2>Bien introuvable</h2>
    <a href="/properties">← Retour aux biens</a>
  </div>
{:else}
  <div class="detail-page">
    <!-- BREADCRUMB -->
    <div class="breadcrumb-bar">
      <div class="bc-inner">
        <a href="/">Accueil</a><span>/</span>
        <a href="/properties">Biens</a><span>/</span>
        <span>{property.titre}</span>
      </div>
    </div>

    <div class="main-layout">
      <!-- COLONNE GAUCHE -->
      <div class="left-col">

        <!-- GALERIE -->
        <div class="gallery">
          {#if photos.length > 0}
            <div class="main-photo">
              <img src={photos[currentPhoto]} alt={property.titre} />
              {#if photos.length > 1}
                <button class="nav-btn prev" on:click={() => currentPhoto = (currentPhoto - 1 + photos.length) % photos.length}>‹</button>
                <button class="nav-btn next" on:click={() => currentPhoto = (currentPhoto + 1) % photos.length}>›</button>
                <div class="photo-count">{currentPhoto + 1} / {photos.length}</div>
              {/if}
            </div>
            {#if photos.length > 1}
              <div class="thumbs">
                {#each photos as ph, i}
                  <button class="thumb" class:active={i === currentPhoto} on:click={() => currentPhoto = i}>
                    <img src={ph} alt="Photo {i+1}" />
                  </button>
                {/each}
              </div>
            {/if}
          {:else}
            <div class="photo-placeholder">
              <span>{typeEmojis[property.type] || '🏠'}</span>
              <p>Aucune photo disponible</p>
            </div>
          {/if}
        </div>

        <!-- INFOS PRINCIPALES -->
        <div class="info-card">
          <div class="title-row">
            <div>
              <div class="tags">
                <span class="tag-type">{typeEmojis[property.type]} {typeLabel[property.type] || property.type}</span>
                <span class="tag-trans" class:vente={property.transaction === 'vente'}>
                  {property.transaction === 'vente' ? '💰 À vendre' : '🔑 À louer'}
                </span>
                {#if property.statut === 'vendu'}
                  <span class="tag-sold">VENDU</span>
                {:else if property.statut === 'loue'}
                  <span class="tag-sold">LOUÉ</span>
                {/if}
              </div>
              <h1>{property.titre}</h1>
              <p class="location">📍 {property.quartier ? property.quartier + ', ' : ''}{property.ville || 'Côte d\'Ivoire'}</p>
            </div>
            <div class="prix-block">
              <span class="prix">{(property.prix || 0).toLocaleString('fr-FR')} FCFA</span>
              {#if property.transaction === 'location'}<span class="prix-sub">/ mois</span>{/if}
            </div>
          </div>
        </div>

        <!-- CARACTÉRISTIQUES -->
        {#if property.surface || property.chambres || property.pieces || property.douches}
          <div class="info-card">
            <h2>Caractéristiques</h2>
            <div class="carac-grid">
              {#if property.surface}<div class="carac"><span class="carac-ico">📐</span><strong>{property.surface} m²</strong><span>Surface</span></div>{/if}
              {#if property.chambres}<div class="carac"><span class="carac-ico">🛏</span><strong>{property.chambres}</strong><span>Chambres</span></div>{/if}
              {#if property.pieces}<div class="carac"><span class="carac-ico">🪟</span><strong>{property.pieces}</strong><span>Pièces</span></div>{/if}
              {#if property.douches}<div class="carac"><span class="carac-ico">🚿</span><strong>{property.douches}</strong><span>Salles de bain</span></div>{/if}
              {#if property.standing}<div class="carac"><span class="carac-ico">⭐</span><strong>{property.standing}</strong><span>Standing</span></div>{/if}
            </div>
          </div>
        {/if}

        <!-- DESCRIPTION -->
        {#if property.description}
          <div class="info-card">
            <h2>Description</h2>
            <p class="desc">{property.description}</p>
          </div>
        {/if}

      </div>

      <!-- COLONNE DROITE -->
      <aside class="right-col">

        <!-- PRIX -->
        <div class="price-card">
          <div class="pc-prix">{(property.prix || 0).toLocaleString('fr-FR')} FCFA</div>
          {#if property.transaction === 'location'}<div class="pc-sub">par mois</div>{/if}
          <div class="pc-ref">Réf: {property._id?.toString().slice(-8).toUpperCase() || 'N/A'}</div>
        </div>

        <!-- CONTACT -->
        <div class="contact-card">
          <h3>📞 Contacter l'agence</h3>
          <a href="tel:+2250102030405" class="contact-tel">+225 01 02 03 04</a>
          <a href="https://wa.me/2250102030405" target="_blank" rel="noopener" class="contact-wa">💬 WhatsApp</a>

          {#if !contactSent}
            <div class="separator"><span>ou envoyez un message</span></div>
            <div class="mini-form">
              <input type="text" bind:value={contactForm.nom} placeholder="Votre nom" />
              <input type="tel" bind:value={contactForm.phone} placeholder="Votre téléphone" />
              <textarea bind:value={contactForm.message} rows="3" placeholder="Votre message..."></textarea>
              <button on:click={sendContact}>Envoyer</button>
            </div>
          {:else}
            <div class="sent-ok">✅ Message envoyé ! Nous vous contacterons rapidement.</div>
          {/if}
        </div>

        <!-- PARTAGER -->
        <div class="share-card">
          <h3>Partager ce bien</h3>
          <div class="share-btns">
            <a href="https://www.facebook.com/sharer/sharer.php?u={encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}" target="_blank" rel="noopener" class="share-fb">📘 Facebook</a>
            <a href="https://wa.me/?text={encodeURIComponent((property.titre || '') + ' - ')}" target="_blank" rel="noopener" class="share-wa">💬 WhatsApp</a>
          </div>
        </div>

        <!-- RETOUR -->
        <a href="/properties" class="back-link">← Retour à la liste</a>

      </aside>
    </div>
  </div>
{/if}

<style>
  .loading-page { text-align: center; padding: 8rem 2rem; color: #94a3b8; }
  .spinner {
    width: 48px; height: 48px; border: 4px solid #e2e8f0;
    border-top-color: #059669; border-radius: 50%;
    animation: spin 0.8s linear infinite; margin: 0 auto 1rem;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .not-found { text-align: center; padding: 8rem 2rem; }
  .not-found span { font-size: 4rem; display: block; margin-bottom: 1rem; }
  .not-found h2 { margin-bottom: 1rem; }
  .not-found a { color: #059669; font-weight: 600; text-decoration: none; }

  .detail-page { background: #f8fafc; min-height: 100vh; }

  .breadcrumb-bar { background: white; border-bottom: 1px solid #e2e8f0; padding: 0.75rem 0; }
  .bc-inner {
    max-width: 1280px; margin: 0 auto; padding: 0 1.5rem;
    display: flex; align-items: center; gap: 0.5rem;
    font-size: 0.85rem; color: #64748b;
  }
  .bc-inner a { color: #059669; text-decoration: none; }
  .bc-inner a:hover { text-decoration: underline; }
  .bc-inner span:last-child { color: #1e293b; font-weight: 500; }

  .main-layout {
    max-width: 1280px; margin: 0 auto; padding: 2rem 1.5rem;
    display: grid; grid-template-columns: 1fr 360px; gap: 2rem; align-items: start;
  }

  /* GALLERY */
  .gallery { margin-bottom: 1.5rem; }
  .main-photo {
    position: relative; border-radius: 16px; overflow: hidden;
    background: #e2e8f0; aspect-ratio: 16/9;
  }
  .main-photo img { width: 100%; height: 100%; object-fit: cover; }
  .nav-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(255,255,255,0.9); border: none; border-radius: 50%;
    width: 44px; height: 44px; font-size: 1.5rem; cursor: pointer;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2); transition: all 0.15s;
  }
  .nav-btn:hover { background: white; }
  .prev { left: 12px; }
  .next { right: 12px; }
  .photo-count {
    position: absolute; bottom: 12px; right: 12px;
    background: rgba(0,0,0,0.5); color: white;
    padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.8rem;
  }
  .photo-placeholder {
    aspect-ratio: 16/9; background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    border-radius: 16px; color: #94a3b8;
  }
  .photo-placeholder span { font-size: 5rem; margin-bottom: 0.5rem; }
  .thumbs { display: flex; gap: 0.5rem; margin-top: 0.75rem; overflow-x: auto; }
  .thumb {
    width: 80px; height: 60px; flex-shrink: 0;
    border-radius: 8px; overflow: hidden; border: 2.5px solid transparent;
    cursor: pointer; transition: border-color 0.15s; padding: 0;
  }
  .thumb img { width: 100%; height: 100%; object-fit: cover; }
  .thumb.active { border-color: #059669; }

  /* CARDS */
  .info-card {
    background: white; border-radius: 16px; padding: 1.75rem;
    border: 1px solid #e2e8f0; margin-bottom: 1.25rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .info-card h2 { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin-bottom: 1.25rem; }

  .title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
  .tags { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
  .tag-type, .tag-trans, .tag-sold {
    padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600;
  }
  .tag-type { background: #f1f5f9; color: #475569; }
  .tag-trans { background: #dcfce7; color: #166534; }
  .tag-trans.vente { background: #dbeafe; color: #1e40af; }
  .tag-sold { background: #fee2e2; color: #991b1b; }
  .title-row h1 { font-size: 1.5rem; font-weight: 800; color: #1e293b; margin-bottom: 0.4rem; }
  .location { color: #64748b; font-size: 0.9rem; }
  .prix-block { text-align: right; flex-shrink: 0; }
  .prix { display: block; font-size: 1.6rem; font-weight: 800; color: #059669; }
  .prix-sub { font-size: 0.8rem; color: #64748b; }

  /* CARAC */
  .carac-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px,1fr)); gap: 1rem; }
  .carac {
    display: flex; flex-direction: column; align-items: center; gap: 0.3rem;
    padding: 1rem; background: #f8fafc; border-radius: 12px; text-align: center;
    border: 1px solid #e2e8f0;
  }
  .carac-ico { font-size: 1.5rem; }
  .carac strong { font-size: 1rem; font-weight: 700; color: #1e293b; }
  .carac span { font-size: 0.75rem; color: #64748b; }

  .desc { color: #475569; line-height: 1.8; font-size: 0.95rem; }

  /* RIGHT COL */
  .right-col { display: flex; flex-direction: column; gap: 1.25rem; position: sticky; top: 88px; }

  .price-card {
    background: linear-gradient(135deg, #064e3b, #059669);
    border-radius: 16px; padding: 1.75rem; text-align: center; color: white;
  }
  .pc-prix { font-size: 1.8rem; font-weight: 800; }
  .pc-sub { font-size: 0.85rem; opacity: 0.8; margin-top: 0.25rem; }
  .pc-ref { font-size: 0.75rem; opacity: 0.6; margin-top: 0.5rem; }

  .contact-card {
    background: white; border-radius: 16px; padding: 1.5rem;
    border: 1px solid #e2e8f0; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  }
  .contact-card h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin-bottom: 1rem; }
  .contact-tel {
    display: block; text-align: center; padding: 0.75rem;
    background: #059669; color: white; border-radius: 10px;
    text-decoration: none; font-weight: 700; margin-bottom: 0.75rem;
    transition: background 0.15s;
  }
  .contact-tel:hover { background: #047857; }
  .contact-wa {
    display: block; text-align: center; padding: 0.75rem;
    background: #dcfce7; color: #166534; border-radius: 10px;
    text-decoration: none; font-weight: 700; transition: background 0.15s;
  }
  .contact-wa:hover { background: #bbf7d0; }
  .separator {
    display: flex; align-items: center; gap: 0.5rem;
    margin: 1rem 0; color: #94a3b8; font-size: 0.8rem;
  }
  .separator::before, .separator::after { content: ''; flex: 1; height: 1px; background: #e2e8f0; }
  .mini-form { display: flex; flex-direction: column; gap: 0.6rem; }
  .mini-form input, .mini-form textarea {
    padding: 0.6rem 0.8rem; border: 1.5px solid #e2e8f0;
    border-radius: 10px; font-size: 0.85rem; font-family: inherit;
    transition: border-color 0.15s;
  }
  .mini-form input:focus, .mini-form textarea:focus { outline: none; border-color: #059669; }
  .mini-form button {
    padding: 0.75rem; background: #1e293b; color: white;
    border: none; border-radius: 10px; font-weight: 700; cursor: pointer;
    transition: background 0.15s;
  }
  .mini-form button:hover { background: #0f172a; }
  .sent-ok {
    background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0;
    border-radius: 10px; padding: 0.75rem; font-size: 0.85rem; text-align: center; margin-top: 0.75rem;
  }

  .share-card {
    background: white; border-radius: 16px; padding: 1.25rem;
    border: 1px solid #e2e8f0;
  }
  .share-card h3 { font-size: 0.9rem; font-weight: 700; color: #1e293b; margin-bottom: 0.75rem; }
  .share-btns { display: flex; gap: 0.5rem; }
  .share-fb, .share-wa {
    flex: 1; text-align: center; padding: 0.5rem;
    border-radius: 8px; text-decoration: none; font-size: 0.8rem; font-weight: 600;
  }
  .share-fb { background: #dbeafe; color: #1e40af; }
  .share-wa { background: #dcfce7; color: #166534; }

  .back-link {
    display: block; text-align: center; padding: 0.75rem;
    color: #64748b; text-decoration: none; font-size: 0.9rem;
    border: 1px solid #e2e8f0; border-radius: 10px; background: white;
    transition: all 0.15s;
  }
  .back-link:hover { color: #059669; border-color: #059669; }

  @media (max-width: 1024px) {
    .main-layout { grid-template-columns: 1fr; }
    .right-col { position: static; }
    .title-row { flex-direction: column; }
    .prix-block { text-align: left; }
  }
</style>
