<script>
  export let property = {};
  export let sold = false;

  let hovered = false;
  let favori = false;

  function toggleFavori(e) {
    e.preventDefault();
    e.stopPropagation();
    favori = !favori;
  }
</script>

<a href="/properties/{property.id}" class="block group">
  <div
    class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    on:mouseenter={() => hovered = true}
    on:mouseleave={() => hovered = false}
  >
    <!-- Image -->
    <div class="relative h-52 bg-gradient-to-br from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
      <span class="text-5xl opacity-30">🏠</span>

      <!-- Favori -->
      <button
        on:click={toggleFavori}
        class="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-xl shadow-sm transition-all z-10 {favori ? 'text-red-500 scale-110' : 'text-slate-400 hover:text-red-400'}"
      >
        {favori ? '❤️' : '🤍'}
      </button>

      <!-- Badge -->
      <span class="absolute bottom-0 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-t-xl">
        {property.categorie || 'Disponible'}
      </span>

      <!-- Overlay au survol -->
      <div class="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-purple-900/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 {sold ? 'hidden' : ''}">
        <span class="bg-white text-purple-900 px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
          Voir le bien →
        </span>
      </div>

      {#if sold}
        <div class="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
          <span class="bg-red-500 text-white px-6 py-2.5 rounded-full font-bold text-sm shadow-lg">VENDU</span>
        </div>
      {/if}
    </div>

    <!-- Contenu -->
    <div class="p-5">
      <div class="flex items-center gap-2 mb-2">
        <span class="w-2 h-2 bg-emerald-400 rounded-full"></span>
        <p class="text-xs text-slate-400 font-medium">{property.ville} · {property.quartier}</p>
      </div>

      <h3 class="font-bold text-slate-800 text-lg mb-1">{property.titre}</h3>
      <p class="text-xl font-extrabold text-slate-900">
        {(property.prix || 0).toLocaleString()} <span class="text-sm font-normal text-slate-400">FCFA</span>
      </p>

      <!-- Métriques -->
      <div class="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
        <div class="text-center">
          <div class="flex items-center justify-center gap-1">
            <span class="text-lg font-bold text-blue-500">{property.chambres || 0}</span>
          </div>
          <p class="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Chambres</p>
        </div>
        <div class="text-center border-x border-slate-100">
          <div class="flex items-center justify-center gap-1">
            <span class="text-lg font-bold text-blue-500">{property.douches || 0}</span>
          </div>
          <p class="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">Douches</p>
        </div>
        <div class="text-center">
          <div class="flex items-center justify-center gap-1">
            <span class="text-lg font-bold text-slate-700">{property.surface || 0}</span>
          </div>
          <p class="text-[11px] text-slate-400 uppercase tracking-wider mt-0.5">m²</p>
        </div>
      </div>
    </div>
  </div>
</a>
