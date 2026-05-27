<script>
  import { goto } from '$app/navigation';

  let form = {
    titre: '', description: '', type: 'residentiel', transaction: 'vente',
    prix: '', surface: '', chambres: '', ville: 'Abidjan', quartier: '', statut: 'publie'
  };
  let loading = false;
  let error = '';
  let success = '';

  async function handleSubmit() {
    error = ''; success = ''; loading = true;
    
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titre: form.titre,
          description: form.description,
          type: form.type,
          transaction: form.transaction,
          prix: parseInt(form.prix) || 0,
          surface: parseInt(form.surface) || 0,
          chambres: parseInt(form.chambres) || 0,
          ville: form.ville,
          quartier: form.quartier,
          statut: 'publie',
          standing: 'standard',
          photos: []
        })
      });

      const data = await res.json();
      console.log('Réponse:', data);

      if (res.ok) {
        success = '✅ Bien créé avec succès !';
        setTimeout(() => goto('/vendeur/biens'), 1500);
      } else {
        error = data.error || 'Erreur lors de la création';
      }
    } catch (e) {
      error = 'Erreur réseau : ' + e.message;
    }
    loading = false;
  }
</script>

<div style="max-width:600px;margin:0 auto;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
    <h1 style="font-size:1.5rem;">➕ Ajouter un bien</h1>
    <a href="/vendeur/biens" style="color:#3b82f6;text-decoration:none;">← Retour</a>
  </div>

  {#if error}
    <div style="background:#fee2e2;color:#991b1b;padding:1rem;border-radius:8px;margin-bottom:1rem;">{error}</div>
  {/if}
  
  {#if success}
    <div style="background:#d1fae5;color:#065f46;padding:2rem;border-radius:12px;text-align:center;">
      <div style="font-size:3rem;">✅</div>
      <h2 style="margin:0.5rem 0;">{success}</h2>
      <p style="color:#64748b;">Redirection en cours...</p>
    </div>
  {:else}
    <form on:submit|preventDefault={handleSubmit} style="display:flex;flex-direction:column;gap:1rem;">
      
      <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;">
        <h3 style="margin:0 0 1rem;">📋 Informations du bien</h3>
        
        <div style="display:flex;flex-direction:column;gap:0.75rem;">
          <div>
            <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Titre *</label>
            <input type="text" bind:value={form.titre} required placeholder="Ex: Villa moderne Cocody" style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" />
          </div>
          
          <div>
            <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Description</label>
            <textarea bind:value={form.description} rows="3" placeholder="Décrivez le bien..." style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;font-family:inherit;"></textarea>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div>
              <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Type</label>
              <select bind:value={form.type} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;">
                <option value="residentiel">🏠 Résidentiel</option>
                <option value="commercial">🏪 Commercial</option>
                <option value="terrain">🌍 Terrain</option>
              </select>
            </div>
            <div>
              <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Transaction</label>
              <select bind:value={form.transaction} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;">
                <option value="vente">💰 Vente</option>
                <option value="location">🔑 Location</option>
              </select>
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem;">
            <div>
              <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Prix FCFA *</label>
              <input type="number" bind:value={form.prix} required placeholder="150000000" style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" />
            </div>
            <div>
              <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Surface m²</label>
              <input type="number" bind:value={form.surface} placeholder="300" style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" />
            </div>
            <div>
              <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Chambres</label>
              <input type="number" bind:value={form.chambres} placeholder="4" style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" />
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
            <div>
              <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Ville *</label>
              <input type="text" bind:value={form.ville} required placeholder="Abidjan" style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" />
            </div>
            <div>
              <label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Quartier</label>
              <input type="text" bind:value={form.quartier} placeholder="Cocody" style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" />
            </div>
          </div>
        </div>
      </div>

      <button type="submit" disabled={loading} style="padding:0.8rem;background:#059669;color:white;border:none;border-radius:12px;font-size:1.1rem;font-weight:600;cursor:pointer;">
        {loading ? '⏳ Création...' : '✅ Créer le bien'}
      </button>
    </form>
  {/if}
</div>
