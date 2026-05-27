<script>
  import { onMount } from 'svelte';
  import AgentSidebar from '$lib/components/public/AgentSidebar.svelte';
  import MapSection from '$lib/components/public/MapSection.svelte';
  import PublicPropertyCard from '$lib/components/public/PublicPropertyCard.svelte';

  const agent = {
    name: 'Kouassi Yannick',
    title: 'Expert Immobilier ImmoPro',
    rating: 4.8,
    reviews: 62,
    phone: '+225 07 89 01 02 03',
    email: 'yannick@immopro.ci',
    address: 'Cocody Riviera, Abidjan',
    avatar: null
  };

  const availableProperties = [
    { id: 'VIL-001', titre: 'Villa Moderne', prix: 150000000, ville: 'Cocody', quartier: 'Riviera Palmeraie', surface: 350, chambres: 5, douches: 3, categorie: 'Neuf', image: null },
    { id: 'VIL-002', titre: 'Appartement Luxe', prix: 85000000, ville: 'Plateau', quartier: 'Centre Ville', surface: 150, chambres: 3, douches: 2, categorie: '2024', image: null },
    { id: 'VIL-003', titre: 'Duplex Standing', prix: 220000000, ville: 'Marcory', quartier: 'Zone 4C', surface: 280, chambres: 4, douches: 3, categorie: 'Neuf', image: null },
  ];

  const soldProperties = [
    { id: 'VIL-101', titre: 'Villa Bingerville', prix: 95000000, ville: 'Bingerville', quartier: 'Akouédo', surface: 200, chambres: 4, douches: 2, categorie: '2023', image: null },
    { id: 'VIL-102', titre: 'Terrain Yopougon', prix: 25000000, ville: 'Yopougon', quartier: 'Siporex', surface: 500, chambres: 0, douches: 0, categorie: '2023', image: null },
  ];
</script>

<svelte:head>
  <title>{agent.name} - Agent ImmoPro</title>
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-slate-50 to-white">
  <!-- Breadcrumb -->
  <div class="max-w-7xl mx-auto px-4 pt-6 pb-2">
    <nav class="flex items-center gap-2 text-sm text-slate-400">
      <a href="/" class="hover:text-blue-600">Accueil</a>
      <span>/</span>
      <a href="/agents" class="hover:text-blue-600">Agents</a>
      <span>/</span>
      <span class="text-slate-600 font-medium">{agent.name}</span>
    </nav>
  </div>

  <div class="max-w-7xl mx-auto px-4 py-4">
    <div class="flex flex-col lg:flex-row gap-8">
      
      <!-- Colonne Gauche : Profil Agent -->
      <div class="w-full lg:w-[380px] flex-shrink-0">
        <div class="lg:sticky lg:top-24">
          <AgentSidebar {agent} />
        </div>
      </div>

      <!-- Colonne Droite : Contenu -->
      <div class="flex-1 min-w-0 space-y-8">
        
        <!-- Stats rapides -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
            <p class="text-2xl font-bold text-blue-600">8</p>
            <p class="text-xs text-slate-400 uppercase mt-1">Biens actifs</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
            <p class="text-2xl font-bold text-emerald-500">30</p>
            <p class="text-xs text-slate-400 uppercase mt-1">Biens vendus</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
            <p class="text-2xl font-bold text-purple-500">★ {agent.rating}</p>
            <p class="text-xs text-slate-400 uppercase mt-1">Note moyenne</p>
          </div>
          <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100 text-center">
            <p class="text-2xl font-bold text-amber-500">4</p>
            <p class="text-xs text-slate-400 uppercase mt-1">En transaction</p>
          </div>
        </div>

        <!-- Carte -->
        <MapSection />

        <!-- Biens Disponibles -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-200">
                {availableProperties.length}
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-800">Biens Disponibles</h2>
                <p class="text-sm text-slate-400">Propriétés actuellement en vente</p>
              </div>
              <div class="flex gap-2 ml-2">
                <button class="w-10 h-10 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition shadow-sm">←</button>
                <button class="w-10 h-10 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-600 transition shadow-sm">→</button>
              </div>
            </div>
            <a href="/properties" class="text-sm font-medium text-slate-400 hover:text-blue-600 transition flex items-center gap-1">
              Voir tout <span>→</span>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each availableProperties as property}
              <PublicPropertyCard {property} />
            {/each}
          </div>
        </section>

        <!-- Récemment Vendus -->
        <section>
          <div class="flex items-center justify-between mb-6">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-emerald-500 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-200">
                {soldProperties.length}
              </div>
              <div>
                <h2 class="text-xl font-bold text-slate-800">Récemment Vendus</h2>
                <p class="text-sm text-slate-400">Biens vendus avec succès</p>
              </div>
              <div class="flex gap-2 ml-2">
                <button class="w-10 h-10 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition shadow-sm">←</button>
                <button class="w-10 h-10 rounded-full border-2 border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500 transition shadow-sm">→</button>
              </div>
            </div>
            <a href="#" class="text-sm font-medium text-slate-400 hover:text-emerald-500 transition flex items-center gap-1">
              Voir tout <span>→</span>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {#each soldProperties as property}
              <PublicPropertyCard {property} sold />
            {/each}
          </div>
        </section>

      </div>
    </div>
  </div>
</div>
