<script>
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  let form = { nom: '', prenom: '', email: '', phone: '', adresse: '', profession: '', bienId: '', loyer: '', dateDebut: '', dateFin: '' };
  let properties = [];
  let loading = false;
  let error = '';
  let success = '';
  let step = 1;

  onMount(async () => {
    const res = await fetch('/api/properties');
    if (res.ok) properties = (await res.json()).properties || [];
  });

  function nextStep() { step = Math.min(step + 1, 3); }
  function prevStep() { step = Math.max(step - 1, 1); }

  async function handleSubmit() {
    error = ''; success = ''; loading = true;
    try {
      const res = await fetch('/api/locataires', {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        success = '✅ Locataire ajouté !';
        setTimeout(() => goto('/vendeur/locataires'), 1500);
      } else {
        error = (await res.json()).error;
      }
    } catch (e) { error = 'Erreur réseau'; }
    loading = false;
  }
</script>

<div style="max-width:700px;margin:0 auto;">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;">
    <h1 style="font-size:1.5rem;">➕ Ajouter un locataire</h1>
    <a href="/vendeur/locataires" style="color:#3b82f6;text-decoration:none;">← Retour</a>
  </div>

  <!-- Barre progression -->
  <div style="display:flex;align-items:center;justify-content:center;margin-bottom:2rem;">
    <span style="width:28px;height:28px;border-radius:50%;background:#3b82f6;color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">1</span><span style="margin-left:0.4rem;font-size:0.85rem;font-weight:600;">Info</span>
    <div style="width:40px;height:2px;background:{step>=2?'#3b82f6':'#e2e8f0'};margin:0 0.8rem;"></div>
    <span style="width:28px;height:28px;border-radius:50%;background:{step>=2?'#3b82f6':'#e2e8f0'};color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">2</span><span style="margin-left:0.4rem;font-size:0.85rem;color:{step>=2?'#1e293b':'#94a3b8'};">Bien</span>
    <div style="width:40px;height:2px;background:{step>=3?'#3b82f6':'#e2e8f0'};margin:0 0.8rem;"></div>
    <span style="width:28px;height:28px;border-radius:50%;background:{step>=3?'#3b82f6':'#e2e8f0'};color:white;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.8rem;">3</span><span style="margin-left:0.4rem;font-size:0.85rem;color:{step>=3?'#1e293b':'#94a3b8'};">Valid.</span>
  </div>

  {#if error}<div style="background:#fee2e2;color:#991b1b;padding:1rem;border-radius:8px;margin-bottom:1rem;">{error}</div>{/if}
  {#if success}<div style="background:#d1fae5;color:#065f46;padding:1rem;border-radius:8px;margin-bottom:1rem;">{success}</div>{/if}

  {#if step === 1}
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;">
      <h3 style="margin:0 0 1rem;">👤 Informations personnelles</h3>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
        <div><label style="display:block;font-size:0.85rem;font-weight:500;color:#475569;margin-bottom:0.3rem;">Nom *</label><input type="text" bind:value={form.nom} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
        <div><label style="display:block;font-size:0.85rem;font-weight:500;color:#475569;margin-bottom:0.3rem;">Prénom *</label><input type="text" bind:value={form.prenom} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
        <div><label style="display:block;font-size:0.85rem;font-weight:500;color:#475569;margin-bottom:0.3rem;">Email *</label><input type="email" bind:value={form.email} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
        <div><label style="display:block;font-size:0.85rem;font-weight:500;color:#475569;margin-bottom:0.3rem;">Téléphone *</label><input type="tel" bind:value={form.phone} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
        <div><label style="display:block;font-size:0.85rem;font-weight:500;color:#475569;margin-bottom:0.3rem;">Adresse</label><input type="text" bind:value={form.adresse} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
        <div><label style="display:block;font-size:0.85rem;font-weight:500;color:#475569;margin-bottom:0.3rem;">Profession</label><input type="text" bind:value={form.profession} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
      </div>
      <div style="text-align:right;margin-top:1.5rem;"><button on:click={nextStep} style="padding:0.6rem 1.2rem;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Suivant →</button></div>
    </div>
  {/if}

  {#if step === 2}
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;">
      <h3 style="margin:0 0 1rem;">🏠 Bien occupé</h3>
      <div style="display:flex;flex-direction:column;gap:0.75rem;">
        <div>
          <label style="display:block;font-size:0.85rem;font-weight:500;color:#475569;margin-bottom:0.3rem;">Bien *</label>
          <select bind:value={form.bienId} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;">
            <option value="">-- Sélectionner un bien --</option>
            {#each properties as p}
              <option value={p._id}>{p.titre} - {p.ville} ({p.prix?.toLocaleString()} FCFA)</option>
            {/each}
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;">
          <div><label style="display:block;font-size:0.85rem;font-weight:500;color:#475569;margin-bottom:0.3rem;">Loyer mensuel *</label><input type="number" bind:value={form.loyer} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
          <div><label style="display:block;font-size:0.85rem;font-weight:500;color:#475569;margin-bottom:0.3rem;">Date début *</label><input type="date" bind:value={form.dateDebut} required style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:1.5rem;">
        <button on:click={prevStep} style="padding:0.6rem 1.2rem;background:#f1f5f9;border:none;border-radius:8px;cursor:pointer;">← Retour</button>
        <button on:click={nextStep} style="padding:0.6rem 1.2rem;background:#3b82f6;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">Suivant →</button>
      </div>
    </div>
  {/if}

  {#if step === 3}
    <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;">
      <h3 style="margin:0 0 1rem;">✅ Récapitulatif</h3>
      <div style="display:flex;flex-direction:column;gap:0.5rem;">
        <div style="padding:0.5rem 0;border-bottom:1px solid #f1f5f9;"><strong style="display:inline-block;width:120px;color:#64748b;">Locataire :</strong> {form.prenom} {form.nom}</div>
        <div style="padding:0.5rem 0;border-bottom:1px solid #f1f5f9;"><strong style="display:inline-block;width:120px;color:#64748b;">Email :</strong> {form.email}</div>
        <div style="padding:0.5rem 0;border-bottom:1px solid #f1f5f9;"><strong style="display:inline-block;width:120px;color:#64748b;">Bien :</strong> {properties.find(p=>p._id===form.bienId)?.titre||'N/A'}</div>
        <div style="padding:0.5rem 0;border-bottom:1px solid #f1f5f9;"><strong style="display:inline-block;width:120px;color:#64748b;">Loyer :</strong> {parseInt(form.loyer||0).toLocaleString()} FCFA</div>
      </div>
      <div style="display:flex;justify-content:space-between;margin-top:1.5rem;">
        <button on:click={prevStep} style="padding:0.6rem 1.2rem;background:#f1f5f9;border:none;border-radius:8px;cursor:pointer;">← Modifier</button>
        <button on:click={handleSubmit} disabled={loading} style="padding:0.6rem 1.5rem;background:#059669;color:white;border:none;border-radius:8px;cursor:pointer;font-weight:600;">{loading?'⏳ Création...':'✅ Ajouter le locataire'}</button>
      </div>
    </div>
  {/if}
</div>
