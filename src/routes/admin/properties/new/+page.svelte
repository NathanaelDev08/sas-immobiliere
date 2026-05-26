<script>
  import { goto } from '$app/navigation';

  let form = {
    titre: '', description: '', type: 'residentiel', transaction: 'vente',
    prix: '', surface: '', pieces: '', chambres: '', douches: '',
    standing: 'standard', ville: 'Abidjan', quartier: '', statut: 'publie'
  };
  let loading = false;
  let error = '';

  async function handleSubmit() {
    error = '';
    loading = true;

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          prix: parseInt(form.prix) || 0,
          surface: parseInt(form.surface) || 0,
          pieces: parseInt(form.pieces) || 0,
          chambres: parseInt(form.chambres) || 0,
          douches: parseInt(form.douches) || 0
        })
      });

      const data = await res.json();

      if (res.ok) {
        alert('✅ Bien créé !');
        goto('/admin/properties');
      } else {
        error = data.error || 'Erreur';
      }
    } catch (e) {
      error = 'Erreur réseau';
    }
    loading = false;
  }
</script>

<div style="max-width:600px;margin:0 auto;padding:1.5rem;">
  <h1 style="margin-bottom:1rem;">➕ Ajouter un bien</h1>
  
  {#if error}
    <div style="background:#fee2e2;color:#991b1b;padding:1rem;border-radius:8px;margin-bottom:1rem;">{error}</div>
  {/if}

  <form on:submit|preventDefault={handleSubmit} style="display:flex;flex-direction:column;gap:1rem;">
    <div>
      <label>Titre *</label>
      <input type="text" bind:value={form.titre} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
    </div>
    <div>
      <label>Description</label>
      <textarea bind:value={form.description} rows="3" style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;"></textarea>
    </div>
    <div style="display:flex;gap:0.5rem;">
      <select bind:value={form.type} style="flex:1;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;">
        <option value="residentiel">Résidentiel</option>
        <option value="commercial">Commercial</option>
        <option value="terrain">Terrain</option>
        <option value="vehicule">Véhicule</option>
      </select>
      <select bind:value={form.transaction} style="flex:1;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;">
        <option value="vente">Vente</option>
        <option value="location">Location</option>
      </select>
    </div>
    <div>
      <label>Prix (FCFA) *</label>
      <input type="number" bind:value={form.prix} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
    </div>
    <div style="display:flex;gap:0.5rem;">
      <input type="number" bind:value={form.surface} placeholder="Surface m²" style="flex:1;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
      <input type="number" bind:value={form.pieces} placeholder="Pièces" style="flex:1;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
      <input type="number" bind:value={form.chambres} placeholder="Chambres" style="flex:1;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
    </div>
    <div style="display:flex;gap:0.5rem;">
      <input type="text" bind:value={form.ville} placeholder="Ville *" required style="flex:1;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
      <input type="text" bind:value={form.quartier} placeholder="Quartier" style="flex:1;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
    </div>
    <button type="submit" disabled={loading} style="padding:0.8rem;background:#059669;color:white;border:none;border-radius:10px;font-weight:600;cursor:pointer;">
      {loading ? '⏳ Création...' : '✅ Créer le bien'}
    </button>
  </form>
</div>
