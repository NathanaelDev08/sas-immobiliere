<script>
  import { goto } from '$app/navigation';
  let email = ''; let password = ''; let error = ''; let loading = false;

  async function handleLogin() {
    error = ''; loading = true;
    const res = await fetch('/api/auth/login', {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) { goto('/vendeur/dashboard'); } else { error = data.error; }
    loading = false;
  }
</script>

<div style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg, #1e3a5f, #1e40af, #3b82f6);">
  <div style="background:white;padding:2.5rem;border-radius:20px;width:400px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
    <div style="text-align:center;margin-bottom:2rem;">
      <div style="width:60px;height:60px;background:#3b82f6;border-radius:16px;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:2rem;">🏠</div>
      <h1 style="font-size:1.5rem;color:#1e293b;margin:0;">Espace Vendeur</h1>
      <p style="color:#94a3b8;font-size:0.9rem;">Gérez vos biens immobiliers</p>
    </div>
    {#if error}<div style="background:#fee2e2;color:#991b1b;padding:0.75rem;border-radius:8px;margin-bottom:1rem;text-align:center;">{error}</div>{/if}
    <form on:submit|preventDefault={handleLogin}>
      <input type="email" bind:value={email} placeholder="Email vendeur" required style="width:100%;padding:0.75rem;margin-bottom:0.75rem;border:2px solid #e2e8f0;border-radius:10px;" />
      <input type="password" bind:value={password} placeholder="Mot de passe" required style="width:100%;padding:0.75rem;margin-bottom:1rem;border:2px solid #e2e8f0;border-radius:10px;" />
      <button type="submit" disabled={loading} style="width:100%;padding:0.75rem;background:#3b82f6;color:white;border:none;border-radius:10px;font-size:1rem;font-weight:600;cursor:pointer;">
        {loading ? 'Connexion...' : '🏠 Accéder à mon espace'}
      </button>
    </form>
    <p style="text-align:center;margin-top:1rem;font-size:0.85rem;color:#94a3b8;">
      Vous n'avez pas de compte ? <a href="/contact" style="color:#3b82f6;">Contactez-nous</a>
    </p>
  </div>
</div>
