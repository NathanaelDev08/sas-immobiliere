<script>
  import { onMount } from 'svelte';
  let user = { nom:'',prenom:'',email:'',phone:'' };
  let message='';
  onMount(async () => { const r = await fetch('/api/auth/me'); if(r.ok) user = (await r.json()).user || user; });
  async function save() { const r = await fetch('/api/auth/update-profile',{method:'PUT',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(user)}); if(r.ok){message='✅ Profil mis à jour';} }
</script>
<div style="max-width:500px;">
  <h1 style="font-size:1.5rem;">⚙️ Paramètres</h1>
  {#if message}<div style="background:#d1fae5;color:#065f46;padding:1rem;border-radius:8px;margin-bottom:1rem;">{message}</div>{/if}
  <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;">
    <div style="display:flex;flex-direction:column;gap:1rem;">
      <div><label style="font-size:0.85rem;font-weight:500;">Prénom</label><input bind:value={user.prenom} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" /></div>
      <div><label style="font-size:0.85rem;font-weight:500;">Nom</label><input bind:value={user.nom} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" /></div>
      <div><label style="font-size:0.85rem;font-weight:500;">Email</label><input bind:value={user.email} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" /></div>
      <div><label style="font-size:0.85rem;font-weight:500;">Téléphone</label><input bind:value={user.phone} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;" /></div>
      <button on:click={save} style="padding:0.7rem;background:#059669;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">💾 Enregistrer</button>
    </div>
  </div>
</div>
