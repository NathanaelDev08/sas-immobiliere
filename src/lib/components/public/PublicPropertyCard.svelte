<script>
  export let property = {};
  export let sold = false;

  $: prix = (property.prix || 0).toLocaleString('fr-FR');
  $: typeEmojis = { residentiel: '🏠', commercial: '🏪', terrain: '🌍', vehicule: '🚗' };
</script>

<div class="card" class:sold>
  <div class="photo">
    {#if property.image}
      <img src={property.image} alt={property.titre} />
    {:else}
      <div class="photo-fallback">
        <span>{typeEmojis[property.type] || '🏠'}</span>
      </div>
    {/if}
    {#if sold}
      <div class="sold-badge">VENDU</div>
    {:else}
      <div class="avail-badge">Disponible</div>
    {/if}
    {#if property.categorie}
      <div class="year-badge">{property.categorie}</div>
    {/if}
  </div>

  <div class="infos">
    <h4>{property.titre || 'Bien immobilier'}</h4>
    <p class="location">📍 {property.quartier || ''}{property.ville ? ', ' + property.ville : ''}</p>
    <div class="details">
      {#if property.surface}<span>📐 {property.surface} m²</span>{/if}
      {#if property.chambres}<span>🛏 {property.chambres} ch.</span>{/if}
      {#if property.douches}<span>🚿 {property.douches}</span>{/if}
    </div>
    <p class="prix">{prix} FCFA</p>
  </div>
</div>

<style>
  .card { background: white; border-radius: 14px; overflow: hidden; border: 1px solid #e2e8f0; transition: all 0.2s; }
  .card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }
  .card.sold { opacity: 0.8; }
  .photo { position: relative; height: 180px; background: #f1f5f9; overflow: hidden; }
  .photo img { width: 100%; height: 100%; object-fit: cover; }
  .photo-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 3rem; background: linear-gradient(135deg, #e2e8f0, #cbd5e1); }
  .sold-badge, .avail-badge, .year-badge {
    position: absolute; top: 10px;
    padding: 0.2rem 0.6rem; border-radius: 999px;
    font-size: 0.7rem; font-weight: 700;
  }
  .sold-badge { left: 10px; background: #ef4444; color: white; }
  .avail-badge { left: 10px; background: #059669; color: white; }
  .year-badge { right: 10px; background: white; color: #1e293b; }
  .infos { padding: 1rem; }
  .infos h4 { margin: 0 0 0.3rem; font-size: 0.95rem; font-weight: 700; color: #1e293b; }
  .location { margin: 0 0 0.5rem; font-size: 0.8rem; color: #64748b; }
  .details { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; flex-wrap: wrap; }
  .details span { font-size: 0.8rem; color: #475569; }
  .prix { margin: 0; font-size: 1rem; font-weight: 700; color: #059669; }
</style>
