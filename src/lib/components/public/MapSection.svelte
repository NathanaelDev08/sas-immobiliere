<script>
  let activeMarker = null;

  const markers = [
    { prix: '75M', lat: 35, lng: 25, color: '#2563eb', label: 'Villa Cocody' },
    { prix: '120M', lat: 50, lng: 50, color: '#7c3aed', label: 'Duplex Marcory' },
    { prix: '45M', lat: 30, lng: 65, color: '#2563eb', label: 'Appart Plateau' },
    { prix: '90M', lat: 60, lng: 40, color: '#7c3aed', label: 'Villa Bingerville' },
  ];

  const legendItems = [
    { label: 'Biens Actifs', value: '8', color: '#2563eb' },
    { label: 'Acheteurs Actifs', value: '4', color: '#7c3aed' },
    { label: 'Biens Vendus', value: '30', color: '#10b981' },
    { label: 'En Transaction', value: '12', color: '#f59e0b' },
  ];
</script>

<div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
  <!-- Titre -->
  <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
    <h3 class="font-bold text-slate-800">📍 Localisation des biens</h3>
    <span class="text-xs text-slate-400">{markers.length} biens sur la carte</span>
  </div>

  <!-- Carte -->
  <div class="relative h-[420px] overflow-hidden" style="background: linear-gradient(135deg, #e8edf2 0%, #dce3e8 30%, #eef1f5 60%, #d5dce3 100%);">
    <!-- Grille de rues -->
    <svg class="absolute inset-0 w-full h-full opacity-20">
      <defs>
        <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
          <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#64748b" stroke-width="0.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>

    <!-- Routes principales -->
    <svg class="absolute inset-0 w-full h-full">
      <line x1="0%" y1="40%" x2="100%" y2="35%" stroke="#94a3b8" stroke-width="8" opacity="0.4" stroke-linecap="round"/>
      <line x1="0%" y1="65%" x2="100%" y2="70%" stroke="#94a3b8" stroke-width="6" opacity="0.3" stroke-linecap="round"/>
      <line x1="30%" y1="0%" x2="25%" y2="100%" stroke="#94a3b8" stroke-width="8" opacity="0.4" stroke-linecap="round"/>
      <line x1="70%" y1="0%" x2="75%" y2="100%" stroke="#94a3b8" stroke-width="5" opacity="0.25" stroke-linecap="round"/>
    </svg>

    <!-- Zones vertes -->
    <div class="absolute left-[10%] top-[20%] w-[15%] h-[25%] bg-emerald-300/30 rounded-full blur-xl"></div>
    <div class="absolute right-[15%] top-[50%] w-[20%] h-[20%] bg-emerald-300/25 rounded-full blur-xl"></div>

    <!-- Marqueurs -->
    {#each markers as marker, i}
      <button
        class="absolute cursor-pointer group z-10"
        style="left: {marker.lng}%; top: {marker.lat}%; transform: translate(-50%, -100%);"
        on:click={(e) => { e.stopPropagation(); activeMarker = activeMarker === i ? null : i; }}
      >
        <!-- Ombrage -->
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-sm"></div>
        
        <!-- Marqueur -->
        <div class="relative w-12 h-14 flex items-start justify-center">
          <svg viewBox="0 0 24 36" class="w-11 h-13 drop-shadow-lg transition-transform group-hover:scale-110 group-hover:-translate-y-1">
            <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 24 12 24s12-15 12-24C24 5.4 18.6 0 12 0z" fill="{marker.color}"/>
            <circle cx="12" cy="11" r="6" fill="white" opacity="0.3"/>
          </svg>
          <span class="absolute top-[6px] left-1/2 -translate-x-1/2 text-white text-[9px] font-extrabold drop-shadow">
            {marker.prix}
          </span>
        </div>
      </button>
    {/each}

    <!-- Tooltip -->
    {#if activeMarker !== null}
      {@const m = markers[activeMarker]}
      <div
        class="absolute bg-white rounded-xl shadow-xl p-4 w-[240px] z-20 border border-slate-100 animate-in"
        style="left: {Math.min(m.lng + 8, 75)}%; top: {Math.max(m.lat - 15, 5)}%;"
      >
        <div class="w-full h-28 bg-slate-100 rounded-lg mb-3 flex items-center justify-center text-3xl">🏠</div>
        <p class="font-bold text-slate-800">{m.label}</p>
        <p class="text-lg font-extrabold text-blue-600">{m.prix} 000 000 FCFA</p>
        <div class="flex gap-3 mt-2 text-xs text-slate-500">
          <span>📏 350 m²</span>
          <span>🛏️ 5 Ch</span>
          <span>🚿 3 Sdb</span>
        </div>
        <button 
          class="mt-2 text-xs text-blue-600 font-medium hover:underline"
          on:click={(e) => { e.stopPropagation(); }}
        >
          Voir le bien →
        </button>
        <!-- Pointe du tooltip -->
        <div class="absolute -bottom-2 left-6 w-4 h-4 bg-white border-r border-b border-slate-100 rotate-45"></div>
      </div>
    {/if}

    <!-- Bouton fermer tooltip -->
    {#if activeMarker !== null}
      <button 
        class="absolute top-3 right-3 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center text-slate-400 hover:text-slate-600 z-20"
        on:click={() => activeMarker = null}
      >
        ✕
      </button>
    {/if}
  </div>

  <!-- Légende -->
  <div class="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 border-t border-slate-100">
    {#each legendItems as item}
      <div class="p-4 flex items-center gap-3 hover:bg-slate-50 cursor-pointer transition">
        <span class="w-4 h-4 rounded-full shadow-sm" style="background: {item.color};"></span>
        <div>
          <p class="text-lg font-bold text-slate-700">{item.value}</p>
          <p class="text-xs text-slate-400 font-medium">{item.label}</p>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .animate-in {
    animation: fadeIn 0.2s ease-out;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>
