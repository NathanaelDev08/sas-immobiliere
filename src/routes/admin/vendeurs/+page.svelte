<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let vendeurs = [];
  let showForm = false;
  let filterCat = '';
  let user = {};
  let isSuperAdmin = false;
  let form = { email: '', phone: '', password: '', nom: '', prenom: '', role: 'proprietaire', categorie: 'particulier', commission: 3, maxBiens: 5 };

  const categories = {
    particulier: { label: '🏠 Particulier', commission: 3, maxBiens: 5, badge: 'background:#dbeafe;color:#1e40af;' },
    entreprise: { label: '🏢 Entreprise', commission: 5, maxBiens: 50, badge: 'background:#e9d5ff;color:#6b21a8;' },
    demarcheur: { label: '🚶 Démarcheur', commission: 10, maxBiens: 20, badge: 'background:#fef3c7;color:#92400e;' },
  };

  onMount(async () => {
    // Vérifier que c'est un Super Admin
    const res = await fetch('/api/auth/me', { credentials: 'include' });
    if (res.ok) {
      user = (await res.json()).user;
      if (user.role !== 'super_admin' && user.role !== 'admin') {
        goto('/admin/dashboard');
        return;
      }
      isSuperAdmin = true;
      loadVendeurs();
    } else {
      goto('/admin/login');
    }
  });

  async function loadVendeurs() {
    const res = await fetch('/api/admin/vendeurs');
    if (res.ok) vendeurs = (await res.json()).vendeurs || [];
  }

  function selectCategorie(cat) {
    form.categorie = cat;
    form.commission = categories[cat].commission;
    form.maxBiens = categories[cat].maxBiens;
  }

  async function createVendeur() {
    await fetch('/api/admin/vendeurs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    showForm = false;
    form = { email: '', phone: '', password: '', nom: '', prenom: '', role: 'proprietaire', categorie: 'particulier', commission: 3, maxBiens: 5 };
    loadVendeurs();
  }

  async function toggleStatut(id, actif) {
    await fetch(`/api/admin/vendeurs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: actif })
    });
    loadVendeurs();
  }

  $: vendeursFiltres = filterCat ? vendeurs.filter(v => v.categorie === filterCat) : vendeurs;
</script>

{#if !isSuperAdmin}
  <div style="text-align:center;padding:4rem;">
    <p style="font-size:2rem;">🔒</p>
    <p style="color:#94a3b8;">Accès réservé au Super Admin</p>
  </div>
{:else}
<div>
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
    <h1 style="font-size:1.5rem;margin:0;">👥 Gestion des Vendeurs</h1>
    <button on:click={() => showForm = !showForm} style="padding:0.6rem 1.2rem;background:#059669;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">
      {showForm ? '✕ Annuler' : '+ Créer un vendeur'}
    </button>
  </div>

  <!-- Filtres par catégorie -->
  <div style="display:flex;gap:0.5rem;margin-bottom:1rem;flex-wrap:wrap;">
    <button on:click={() => filterCat = ''} style="padding:0.4rem 0.8rem;border-radius:999px;border:1px solid #e2e8f0;background:{filterCat === '' ? '#059669' : 'white'};color:{filterCat === '' ? 'white' : '#475569'};cursor:pointer;font-size:0.85rem;">Tous ({vendeurs.length})</button>
    {#each Object.entries(categories) as [key, cat]}
      <button on:click={() => filterCat = key} style="padding:0.4rem 0.8rem;border-radius:999px;border:1px solid #e2e8f0;background:{filterCat === key ? '#059669' : 'white'};color:{filterCat === key ? 'white' : '#475569'};cursor:pointer;font-size:0.85rem;">
        {cat.label} ({vendeurs.filter(v => v.categorie === key).length})
      </button>
    {/each}
  </div>

  <!-- Formulaire création -->
  {#if showForm}
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;margin-bottom:1.5rem;">
      <h2 style="font-size:1.1rem;margin:0 0 1rem;">Créer un vendeur</h2>

      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-bottom:1rem;">
        {#each Object.entries(categories) as [key, cat]}
          <div on:click={() => selectCategorie(key)} style="padding:1rem;border-radius:10px;border:2px solid {form.categorie === key ? '#059669' : '#e2e8f0'};cursor:pointer;text-align:center;background:{form.categorie === key ? '#ecfdf5' : 'white'};">
            <div style="font-size:1.5rem;">{cat.label.split(' ')[0]}</div>
            <div style="font-weight:600;font-size:0.9rem;">{cat.label.split(' ')[1]}</div>
            <div style="font-size:0.75rem;color:#94a3b8;">{cat.commission}% · {cat.maxBiens} biens</div>
          </div>
        {/each}
      </div>

      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;">
        <input bind:value={form.nom} placeholder="Nom" style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
        <input bind:value={form.prenom} placeholder="Prénom" style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
        <input bind:value={form.email} placeholder="Email" type="email" style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
        <input bind:value={form.phone} placeholder="Téléphone" style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
        <input bind:value={form.password} placeholder="Mot de passe" type="password" style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
      </div>

      <div style="display:flex;gap:1rem;margin-top:1rem;align-items:center;">
        <div><strong>Commission :</strong> {form.commission}%</div>
        <div><strong>Max biens :</strong> {form.maxBiens}</div>
      </div>

      <button on:click={createVendeur} style="margin-top:1rem;padding:0.7rem 1.5rem;background:#059669;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">✅ Créer</button>
    </div>
  {/if}

  <!-- Tableau -->
  <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f8fafc;">
          <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Vendeur</th>
          <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Catégorie</th>
          <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Commission</th>
          <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Biens</th>
          <th style="text-align:left;padding:0.75rem;font-size:0.75rem;color:#94a3b8;">Statut</th>
        </tr>
      </thead>
      <tbody>
        {#each vendeursFiltres as v}
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:0.75rem;">
              <div style="display:flex;align-items:center;gap:0.5rem;">
                <div style="width:32px;height:32px;border-radius:50%;background:#d1fae5;color:#065f46;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.7rem;">{v.prenom?.[0]}{v.nom?.[0]}</div>
                <div>
                  <strong style="font-size:0.9rem;">{v.prenom} {v.nom}</strong>
                  <div style="font-size:0.75rem;color:#94a3b8;">{v.email}</div>
                </div>
              </div>
            </td>
            <td style="padding:0.75rem;">
              <span style="padding:0.2rem 0.6rem;border-radius:999px;font-size:0.75rem;font-weight:600;{categories[v.categorie]?.badge || 'background:#f1f5f9;color:#475569;'}">
                {categories[v.categorie]?.label || v.categorie || 'Particulier'}
              </span>
            </td>
            <td style="padding:0.75rem;"><strong>{v.commission || 5}%</strong></td>
            <td style="padding:0.75rem;">{v.biensCount || 0}/{v.maxBiens || 5}</td>
            <td style="padding:0.75rem;">
              <button on:click={() => toggleStatut(v._id, !v.isActive)} style="padding:0.3rem 0.7rem;border:none;border-radius:999px;font-size:0.75rem;cursor:pointer;background:{v.isActive ? '#d1fae5' : '#fee2e2'};color:{v.isActive ? '#065f46' : '#991b1b'};">
                {v.isActive ? 'Actif' : 'Inactif'}
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
{/if}
