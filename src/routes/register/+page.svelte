<script>
  import { goto } from '$app/navigation';

  let nom = '', prenom = '', email = '', phone = '', password = '', role = 'client';
  let error = '';

  async function register() {
    error = '';
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nom, prenom, email, phone, password, role })
    });
    
    const data = await res.json();
    
    if (res.ok) {
      goto('/dashboard');
    } else {
      error = data.error;
    }
  }
</script>

<div class="container">
  <h1>Inscription</h1>
  
  {#if error}
    <p class="error">{error}</p>
  {/if}

  <form on:submit|preventDefault={register}>
    <input type="text" bind:value={nom} placeholder="Nom" required />
    <input type="text" bind:value={prenom} placeholder="Prénom" required />
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="tel" bind:value={phone} placeholder="Téléphone" required />
    <input type="password" bind:value={password} placeholder="Mot de passe" required />
    <select bind:value={role}>
      <option value="client">Client</option>
      <option value="proprietaire">Propriétaire</option>
      <option value="agent">Agent</option>
    </select>
    <button type="submit">S'inscrire</button>
  </form>
  
  <a href="/login">Déjà un compte</a>
</div>

<style>
  .container { max-width: 400px; margin: 2rem auto; }
  form { display: flex; flex-direction: column; gap: 1rem; }
  input, select { padding: 0.8rem; border: 1px solid #ddd; border-radius: 5px; }
  button { padding: 0.8rem; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; }
  .error { color: red; background: #ffeaa7; padding: 0.5rem; border-radius: 5px; }
</style>
