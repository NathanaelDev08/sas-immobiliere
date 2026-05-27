<script>
  import { onMount } from 'svelte';
  let user = { nom:'',prenom:'',email:'',phone:'' }; let msg='';
  onMount(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) user = (await res.json()).user || user;
    } catch(e) {}
  });
  async function save() {
    const res = await fetch('/api/auth/update-profile',{
      method:'PUT',credentials:'include',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(user)
    });
    if (res.ok) { msg='✅ Profil mis à jour'; }
  }
</script>
<div style="max-width:500px;">
  <h1 style="font-size:1.5rem;">⚙️ Paramètres</h1>
  {#if msg}<div style="background:#d1fae5;color:#065f46;padding:1rem;border-radius:8px;margin-bottom:1rem;">{msg}</div>{/if}
  <div style="background:white;border:1px solid #e2e8f0;border-radius:12px;padding:1.5rem;display:flex;flex-direction:column;gap:1rem;">
    <div><label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Prénom</label><input bind:value={user.prenom} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
    <div><label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Nom</label><input bind:value={user.nom} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
    <div><label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Email</label><input bind:value={user.email} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
    <div><label style="display:block;font-size:0.85rem;font-weight:500;margin-bottom:0.3rem;">Téléphone</label><input bind:value={user.phone} style="width:100%;padding:0.6rem;border:1px solid #e2e8f0;border-radius:8px;box-sizing:border-box;" /></div>
    <button on:click={save} style="padding:0.7rem;background:#3b82f6;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;">💾 Enregistrer</button>
  </div>
</div>
