<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let form = {
    locataireNom: '',
    locataireEmail: '',
    locatairePhone: '',
    bienId: '',
    type: 'bail_1an',
    dateDebut: '',
    dateFin: '',
    loyer: '',
    caution: ''
  };
  let properties = [];
  let loading = false;
  let error = '';
  let success = '';

  onMount(async () => {
    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        properties = data.properties || [];
      }
    } catch (e) {
      error = 'Impossible de charger les biens';
    }
  });

  async function handleSubmit() {
    error = '';
    success = '';
    loading = true;

    try {
      const res = await fetch('/api/contrats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locataireNom: form.locataireNom,
          locataireEmail: form.locataireEmail,
          locatairePhone: form.locatairePhone,
          bienId: form.bienId,
          type: form.type,
          dateDebut: form.dateDebut,
          dateFin: form.dateFin,
          loyer: parseInt(form.loyer) || 0,
          caution: parseInt(form.caution) || 0
        })
      });

      const data = await res.json();
      console.log('Réponse contrat:', data);

      if (res.ok) {
        success = '✅ Contrat créé avec succès ! Redirection...';
        setTimeout(() => goto('/admin/contrats'), 1500);
      } else {
        error = data.error || 'Erreur lors de la création du contrat';
      }
    } catch (e) {
      error = 'Erreur réseau : ' + e.message;
    }
    loading = false;
  }
</script>

<svelte:head>
  <title>Nouveau contrat - ImmoPro</title>
</svelte:head>

<div style="max-width:550px;margin:0 auto;padding:1.5rem;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
    <h1 style="margin:0;">📄 Nouveau contrat</h1>
    <a href="/admin/contrats" style="color:#3b82f6;text-decoration:none;">← Retour</a>
  </div>

  {#if error}
    <div style="background:#fee2e2;color:#991b1b;padding:1rem;border-radius:8px;margin-bottom:1rem;">{error}</div>
  {/if}
  {#if success}
    <div style="background:#d1fae5;color:#065f46;padding:1rem;border-radius:8px;margin-bottom:1rem;">{success}</div>
  {/if}

  <form on:submit|preventDefault={handleSubmit} style="display:flex;flex-direction:column;gap:1rem;">
    
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;">
      <h3 style="margin:0 0 1rem;">👤 Locataire</h3>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.25rem;">Nom complet *</label>
          <input type="text" bind:value={form.locataireNom} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
        </div>
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.25rem;">Email</label>
          <input type="email" bind:value={form.locataireEmail} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
        </div>
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.25rem;">Téléphone</label>
          <input type="tel" bind:value={form.locatairePhone} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
        </div>
      </div>
    </div>

    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;">
      <h3 style="margin:0 0 1rem;">🏠 Détails du contrat</h3>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.25rem;">Bien *</label>
          <select bind:value={form.bienId} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;">
            <option value="">-- Sélectionner un bien --</option>
            {#each properties as p}
              <option value={p._id}>{p.titre} - {p.ville} ({p.prix?.toLocaleString()} FCFA)</option>
            {/each}
          </select>
        </div>
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.25rem;">Type de contrat</label>
          <select bind:value={form.type} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;">
            <option value="bail_1an">Bail 1 an</option>
            <option value="bail_3ans">Bail 3 ans</option>
            <option value="bail_commercial">Bail commercial</option>
            <option value="cdd">CDD</option>
          </select>
        </div>
        <div style="display:flex;gap:0.5rem;">
          <div style="flex:1;">
            <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.25rem;">Date début *</label>
            <input type="date" bind:value={form.dateDebut} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
          </div>
          <div style="flex:1;">
            <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.25rem;">Date fin *</label>
            <input type="date" bind:value={form.dateFin} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
          </div>
        </div>
      </div>
    </div>

    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.25rem;">
      <h3 style="margin:0 0 1rem;">💰 Finances</h3>
      <div style="display:flex;gap:0.5rem;">
        <div style="flex:1;">
          <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.25rem;">Loyer mensuel (FCFA) *</label>
          <input type="number" bind:value={form.loyer} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
        </div>
        <div style="flex:1;">
          <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.25rem;">Caution (FCFA)</label>
          <input type="number" bind:value={form.caution} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
        </div>
      </div>
    </div>

    <button type="submit" disabled={loading} style="padding:0.8rem;background:#059669;color:white;border:none;border-radius:10px;font-weight:600;font-size:1rem;cursor:pointer;">
      {loading ? '⏳ Création en cours...' : '📄 Créer le contrat'}
    </button>
  </form>
</div>
