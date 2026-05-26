<script>
  import { onMount } from 'svelte';
  let stats = { totalBiens: 0, biensPublies: 0, biensVendus: 0, totalVues: 0 };
  let biens = [];
  onMount(async () => {
    try {
      const res = await fetch('/api/vendeur/stats');
      if (res.ok) {
        const data = await res.json();
        stats = data.stats || stats;
        biens = data.biensRecents || [];
      }
    } catch(e) {}
  });
</script>

<div>
  <h1 style="margin:0 0 0.25rem;font-size:1.5rem;color:#1e293b;">📊 Dashboard</h1>
  <p style="margin:0 0 1.5rem;color:#94a3b8;">Vue d'ensemble de votre activité</p>

  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:1rem;margin-bottom:1.5rem;">
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;">
      <div style="font-size:1.5rem;">🏠</div>
      <div style="font-size:1.5rem;font-weight:700;color:#1e293b;">{stats.totalBiens}</div>
      <div style="font-size:0.8rem;color:#94a3b8;">Biens</div>
    </div>
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;">
      <div style="font-size:1.5rem;">✅</div>
      <div style="font-size:1.5rem;font-weight:700;color:#1e293b;">{stats.biensPublies}</div>
      <div style="font-size:0.8rem;color:#94a3b8;">Publiés</div>
    </div>
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;">
      <div style="font-size:1.5rem;">💰</div>
      <div style="font-size:1.5rem;font-weight:700;color:#1e293b;">{stats.biensVendus}</div>
      <div style="font-size:0.8rem;color:#94a3b8;">Vendus</div>
    </div>
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;">
      <div style="font-size:1.5rem;">👀</div>
      <div style="font-size:1.5rem;font-weight:700;color:#1e293b;">{stats.totalVues}</div>
      <div style="font-size:0.8rem;color:#94a3b8;">Vues</div>
    </div>
  </div>

  <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem;">
      <h2 style="font-size:1rem;margin:0;">🏠 Derniers biens</h2>
      <a href="/vendeur/biens/new" style="background:#059669;color:white;padding:0.4rem 0.8rem;border-radius:6px;text-decoration:none;font-size:0.85rem;">+ Ajouter</a>
    </div>
    {#if biens.length > 0}
      {#each biens as b}
        <div style="display:flex;justify-content:space-between;padding:0.6rem 0;border-bottom:1px solid #f1f5f9;">
          <div><strong style="font-size:0.9rem;">{b.titre}</strong><div style="font-size:0.8rem;color:#94a3b8;">{b.prix?.toLocaleString()} FCFA</div></div>
          <div style="font-size:0.8rem;color:#94a3b8;">👀 {b.vues||0}</div>
        </div>
      {/each}
    {:else}
      <div style="text-align:center;padding:2rem;color:#94a3b8;">Aucun bien. <a href="/vendeur/biens/new">Ajoutez votre premier bien !</a></div>
    {/if}
  </div>
</div>
