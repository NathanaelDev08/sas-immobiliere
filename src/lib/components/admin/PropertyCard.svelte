<script>
  export let property = {};

  const statusColors = {
    "Disponible": "bg-emerald-100 text-emerald-700",
    "Occupé": "bg-amber-100 text-amber-700",
    "En travaux": "bg-slate-100 text-slate-700"
  };

  const statusDots = {
    "Disponible": "bg-emerald-500",
    "Occupé": "bg-amber-500",
    "En travaux": "bg-slate-400"
  };

  const typeIcons = {
    "Villa": "🏠",
    "Appartement": "🏢",
    "Terrain": "🌍",
    "Local commercial": "🏪"
  };
</script>

<div class="card">
  <div class="card-header">
    <div class="status-group">
      <span class="dot {statusDots[property.status] || 'bg-slate-400'}" />
      <span class="status-badge {statusColors[property.status] || 'bg-slate-100 text-slate-700'}">
        {property.status}
      </span>
    </div>
    <span class="update-time">{property.lastUpdate}</span>
  </div>

  <div class="card-title">
    <h3>{property.id}</h3>
    <p class="location">📍 {property.quartier}</p>
  </div>

  <div class="card-body">
    <div class="metrics">
      <div>
        <p class="value">{property.prix.toLocaleString()} FCFA</p>
        <p class="label">Prix</p>
      </div>
      <div>
        <p class="value">{property.surface} m²</p>
        <p class="label">Surface</p>
      </div>
    </div>

    <div class="details">
      {#if property.pieces > 0}
        <div class="detail-item">🚪 {property.pieces} Pièces</div>
      {/if}
      {#if property.chambres > 0 || property.douches > 0}
        <div class="detail-item">🛏️ {property.chambres} Ch, {property.douches} Dch</div>
      {/if}
      <div class="detail-item" class:disabled={!property.garage}>
        {property.garage ? '🚗 Garage inclus' : '🚗 Sans garage'}
      </div>
    </div>

    <div class="icon-col">
      <div class="type-icon">
        {typeIcons[property.type] || '🏠'}
      </div>
    </div>
  </div>
</div>

<style>
  .card {
    background: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    padding: 1.25rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    transition: box-shadow 0.2s;
    box-sizing: border-box;
  }
  .card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .status-group { display: flex; align-items: center; gap: 0.5rem; }
  .dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .status-badge {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.15rem 0.5rem;
    border-radius: 999px;
  }
  .update-time { font-size: 0.75rem; color: #94a3b8; }

  .card-title { margin-bottom: 1rem; }
  .card-title h3 { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0; word-break: break-all; }
  .location { font-size: 0.85rem; color: #64748b; margin: 0.25rem 0 0; }

  .card-body {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr;
    gap: 0.75rem;
  }

  .metrics { display: flex; flex-direction: column; gap: 0.75rem; }
  .value { font-weight: 700; color: #1e293b; margin: 0; font-size: 0.9rem; }
  .label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; margin: 0.1rem 0 0; }

  .details { display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.82rem; color: #475569; }
  .detail-item { display: flex; align-items: center; gap: 0.25rem; }
  .disabled { color: #cbd5e1; }

  .icon-col { display: flex; align-items: center; justify-content: center; }
  .type-icon {
    width: 48px; height: 48px;
    background: #ecfdf5;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    .card { padding: 1rem; }
    .card-body { grid-template-columns: 1fr 1fr; }
    .icon-col { display: none; }
  }
</style>
