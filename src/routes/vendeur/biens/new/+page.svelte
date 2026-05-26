<script>
  import { goto } from '$app/navigation';
  let form = { titre:'',description:'',type:'residentiel',transaction:'vente',prix:'',surface:'',chambres:'',ville:'Abidjan',quartier:'',statut:'publie' };
  let loading=false,error='';
  async function handle(){ error='';loading=true; const r=await fetch('/api/properties',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,prix:parseInt(form.prix)||0})}); if(r.ok){goto('/vendeur/biens')}else{error=(await r.json()).error} loading=false; }
</script>
<div style="max-width:500px;margin:0 auto;">
  <h1 style="font-size:1.5rem;">➕ Ajouter un bien</h1>
  {#if error}<div style="background:#fee2e2;color:#991b1b;padding:1rem;border-radius:8px;margin-bottom:1rem;">{error}</div>{/if}
  <form on:submit|preventDefault={handle} style="display:flex;flex-direction:column;gap:0.75rem;">
    <input bind:value={form.titre} placeholder="Titre *" required style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
    <textarea bind:value={form.description} placeholder="Description" rows="3" style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;"></textarea>
    <select bind:value={form.type} style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;"><option value="residentiel">Résidentiel</option><option value="commercial">Commercial</option><option value="terrain">Terrain</option></select>
    <select bind:value={form.transaction} style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;"><option value="vente">Vente</option><option value="location">Location</option></select>
    <input bind:value={form.prix} type="number" placeholder="Prix FCFA *" required style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
    <input bind:value={form.surface} type="number" placeholder="Surface m²" style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
    <input bind:value={form.chambres} type="number" placeholder="Chambres" style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
    <input bind:value={form.ville} placeholder="Ville *" required style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
    <input bind:value={form.quartier} placeholder="Quartier" style="padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" />
    <button type="submit" disabled={loading} style="padding:0.8rem;background:#059669;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">{loading?'Création...':'✅ Créer'}</button>
  </form>
</div>
