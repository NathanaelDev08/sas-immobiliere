<script>
  import { goto } from '$app/navigation';

  let email = '';
  let password = '';
  let error = '';
  let loading = false;

  async function handleLogin() {
    error = '';
    loading = true;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        goto('/dashboard');
      } else {
        error = data.error || 'Erreur de connexion';
      }
    } catch (e) {
      error = 'Erreur réseau';
    }

    loading = false;
  }
</script>

<div class="auth-container">
  <h1>🔐 Connexion</h1>

  {#if error}
    <div class="error">{error}</div>
  {/if}

  <form on:submit|preventDefault={handleLogin}>
    <label>
      Email
      <input type="email" bind:value={email} required autocomplete="email" />
    </label>

    <label>
      Mot de passe
      <input type="password" bind:value={password} required autocomplete="current-password" />
    </label>

    <button type="submit" disabled={loading}>
      {loading ? 'Connexion...' : 'Se connecter'}
    </button>
  </form>

  <p class="link">
    Pas encore de compte ? <a href="/register">S'inscrire</a>
  </p>
</div>

<style>
  .auth-container {
    max-width: 400px;
    margin: 3rem auto;
    padding: 2rem;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  }

  h1 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #2c3e50;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-weight: 500;
  }

  input {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 1rem;
  }

  input:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52,152,219,0.2);
  }

  button {
    padding: 0.8rem;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    cursor: pointer;
    margin-top: 0.5rem;
  }

  button:hover {
    background: #2980b9;
  }

  button:disabled {
    background: #95a5a6;
    cursor: not-allowed;
  }

  .error {
    background: #ffeaa7;
    color: #d63031;
    padding: 0.8rem;
    border-radius: 5px;
    margin-bottom: 1rem;
    text-align: center;
  }

  .link {
    text-align: center;
    margin-top: 1rem;
  }

  .link a {
    color: #3498db;
    text-decoration: none;
  }
</style>
