<script>
  let email = 'a@a.com';
  let password = '123456';
  let error = '';
  let loading = false;

  async function handleLogin() {
    error = '';
    loading = true;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = '/admin/dashboard';
    } else {
      error = data.error || 'Erreur de connexion';
    }

    loading = false;
  }
</script>

<div class="login-page">
  <div class="login-card">
    <div class="logo">
      <div class="logo-icon">🏢</div>
      <h1>ImmoPro</h1>
      <p>Panneau d'administration</p>
    </div>

    {#if error}
      <div class="error-box">{error}</div>
    {/if}

    <form on:submit|preventDefault={handleLogin}>
      <input type="email" bind:value={email} placeholder="Email" required />
      <input type="password" bind:value={password} placeholder="Mot de passe" required />
      <button type="submit" disabled={loading}>
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>
    </form>
  </div>
</div>

<style>
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8fafc;
  }
  .login-card {
    background: white;
    padding: 2.5rem;
    border-radius: 16px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    border: 1px solid #e2e8f0;
  }
  .logo { text-align: center; margin-bottom: 2rem; }
  .logo-icon { font-size: 2.5rem; }
  h1 { color: #1e293b; margin: 0.5rem 0; }
  p { color: #94a3b8; margin: 0; }

  .error-box {
    background: #fee2e2;
    color: #991b1b;
    padding: 0.75rem;
    border-radius: 8px;
    margin-bottom: 1rem;
    text-align: center;
  }

  form { display: flex; flex-direction: column; gap: 0.75rem; }
  input {
    padding: 0.75rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
  }
  button {
    padding: 0.75rem;
    background: #059669;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
  }
  button:disabled { background: #9ca3af; cursor: not-allowed; }
  button:hover:not(:disabled) { background: #047857; }
</style>
