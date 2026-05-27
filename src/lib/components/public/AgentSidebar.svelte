<script>
  export let agent = {};
</script>

<div class="sidebar">
  <div class="avatar-section">
    {#if agent.avatar}
      <img src={agent.avatar} alt={agent.name} class="avatar" />
    {:else}
      <div class="avatar-fallback">{agent.name?.charAt(0) || 'A'}</div>
    {/if}
    <div class="verified-badge">✓ Vérifié</div>
  </div>

  <h2 class="agent-name">{agent.name || 'Agent'}</h2>
  <p class="agent-title">{agent.title || 'Agent Immobilier'}</p>

  <div class="rating">
    <span class="stars">{'★'.repeat(Math.floor(agent.rating || 5))}</span>
    <span class="rating-text">{agent.rating || 5}/5 ({agent.reviews || 0} avis)</span>
  </div>

  <div class="contact-info">
    {#if agent.phone}
      <a href="tel:{agent.phone}" class="contact-item">
        <span class="ci-icon">📞</span>
        <span>{agent.phone}</span>
      </a>
    {/if}
    {#if agent.email}
      <a href="mailto:{agent.email}" class="contact-item">
        <span class="ci-icon">📧</span>
        <span>{agent.email}</span>
      </a>
    {/if}
    {#if agent.address}
      <div class="contact-item">
        <span class="ci-icon">📍</span>
        <span>{agent.address}</span>
      </div>
    {/if}
  </div>

  <a href="/contact" class="btn-contact">Contacter l'agent</a>
</div>

<style>
  .sidebar {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 24px rgba(0,0,0,0.06);
    text-align: center;
  }
  .avatar-section { position: relative; display: inline-block; margin-bottom: 1rem; }
  .avatar { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #e2e8f0; }
  .avatar-fallback {
    width: 100px; height: 100px; border-radius: 50%;
    background: linear-gradient(135deg, #059669, #0284c7);
    color: white; font-size: 2.5rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center;
  }
  .verified-badge {
    position: absolute; bottom: 0; right: 0;
    background: #059669; color: white;
    font-size: 0.7rem; font-weight: 700;
    padding: 0.2rem 0.4rem; border-radius: 999px;
  }
  .agent-name { font-size: 1.3rem; font-weight: 700; color: #1e293b; margin: 0 0 0.3rem; }
  .agent-title { color: #64748b; font-size: 0.85rem; margin: 0 0 1rem; }
  .rating { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-bottom: 1.5rem; }
  .stars { color: #f59e0b; font-size: 1rem; }
  .rating-text { font-size: 0.8rem; color: #64748b; }
  .contact-info { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; text-align: left; }
  .contact-item { display: flex; align-items: center; gap: 0.75rem; color: #475569; text-decoration: none; font-size: 0.85rem; padding: 0.5rem; border-radius: 8px; transition: background 0.2s; }
  .contact-item:hover { background: #f1f5f9; }
  .ci-icon { font-size: 1rem; width: 20px; text-align: center; }
  .btn-contact {
    display: block; width: 100%;
    background: #059669; color: white;
    padding: 0.8rem; border-radius: 12px;
    text-decoration: none; font-weight: 700;
    transition: background 0.2s;
  }
  .btn-contact:hover { background: #047857; }
</style>
