<script>
  export let property = {};
  let favori = false;
  let imageLoaded = false;

  function toggleFavori(e) { e.preventDefault(); e.stopPropagation(); favori = !favori; }
  
  $: photoUrl = property.photos?.[0] || null;
  $: propertyId = property._id || property.id || '';
  $: prix = property.prix || 0;
  $: chambres = property.chambres || property.pieces || 0;
  $: surface = property.surface || 0;
  $: isSold = property.statut === 'vendu' || property.statut === 'loue';

  const typeEmojis = { residentiel: '🏠', commercial: '🏪', terrain: '🌍', vehicule: '🚗' };
</script>

<a href="/properties/{propertyId}" class="card-link">
  <div class="card animate-in">
    <div class="photo">
      {#if photoUrl}
        <img 
          src={photoUrl} 
          alt={property.titre || 'Bien'} 
          class:loaded={imageLoaded}
          on:load={() => imageLoaded = true}
          on:error={(e) => { e.target.style.display = 'none'; e.target.parentElement.querySelector('.photo-fallback').style.display = 'flex'; }}
          loading="lazy"
        />
      {/if}
      <div class="photo-fallback" style="display:{photoUrl ? 'none' : 'flex'}">
        <span class="fallback-icon">{typeEmojis[property.type] || '🏠'}</span>
      </div>
      
      <!-- Skeleton loader -->
      {#if photoUrl && !imageLoaded}
        <div class="skeleton"></div>
      {/if}

      <button class="favori" on:click={toggleFavori}>
        <span class="heart-icon" class:liked={favori}>{favori ? '❤️' : '🤍'}</span>
      </button>

      {#if isSold}
        <div class="sold-overlay"><span>{property.statut === 'vendu' ? 'VENDU' : 'LOUÉ'}</span></div>
      {/if}
      
      <span class="badge animate-slide-up">
        {property.transaction === 'vente' ? 'À vendre' : property.transaction === 'location' ? 'À louer' : 'Dispo'}
      </span>
    </div>

    <div class="infos">
      <div class="titre-ligne">
        <h3>{property.ville}{property.quartier ? ', ' + property.quartier : ''}</h3>
        <span class="note">⭐ 4.8</span>
      </div>
      <p class="sous-titre">{chambres} chambre{chambres > 1 ? 's' : ''} · {surface} m²</p>
      <p class="prix"><strong>{prix.toLocaleString()} FCFA</strong>{property.transaction === 'location' ? ' / mois' : ''}</p>
    </div>
  </div>
</a>

<style>
  .card-link { text-decoration: none; color: inherit; display: block; }

  .card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
    cursor: pointer;
  }
  .card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  }

  .animate-in {
    animation: fadeInUp 0.5s ease forwards;
    opacity: 0;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .photo {
    position: relative;
    height: 280px;
    overflow: hidden;
    border-radius: 12px;
    background: #e2e8f0;
  }
  .photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    transition: opacity 0.5s ease, transform 0.5s ease;
    opacity: 0;
  }
  .photo img.loaded {
    opacity: 1;
  }
  .card:hover .photo img {
    transform: scale(1.05);
  }

  .skeleton {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }

  .photo-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
  }
  .fallback-icon {
    font-size: 4rem;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }

  .favori {
    position: absolute;
    top: 12px;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 2;
    padding: 4px;
  }
  .heart-icon {
    font-size: 1.4rem;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.2));
    transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    display: inline-block;
  }
  .heart-icon:hover {
    transform: scale(1.3);
  }
  .heart-icon.liked {
    animation: heartBeat 0.6s ease;
  }

  @keyframes heartBeat {
    0% { transform: scale(1); }
    25% { transform: scale(1.3); }
    50% { transform: scale(0.95); }
    100% { transform: scale(1); }
  }

  .badge {
    position: absolute;
    top: 12px;
    left: 12px;
    background: white;
    color: #1e293b;
    padding: 0.3rem 0.7rem;
    border-radius: 999px;
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 2;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  }

  .animate-slide-up {
    animation: slideUp 0.4s ease 0.2s both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .sold-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3;
    animation: fadeIn 0.3s ease;
  }
  .sold-overlay span {
    background: #ef4444;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 8px;
    font-weight: 700;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .infos { padding: 12px 4px 4px; }
  .titre-ligne { display: flex; justify-content: space-between; align-items: flex-start; }
  .titre-ligne h3 { font-size: 0.95rem; font-weight: 600; color: #222; margin: 0; }
  .note { font-size: 0.85rem; color: #222; }
  .sous-titre { color: #717171; font-size: 0.9rem; margin: 4px 0; }
  .prix { margin: 4px 0 0; font-size: 0.95rem; color: #222; }
</style>
