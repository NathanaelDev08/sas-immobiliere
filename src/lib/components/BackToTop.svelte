<script>
  let visible = false;
  
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleScroll() {
    visible = window.scrollY > 300;
  }
</script>

<svelte:window on:scroll={handleScroll} />

{#if visible}
  <button class="back-to-top" on:click={scrollToTop} title="Retour en haut">
    ⬆️
  </button>
{/if}

<style>
  .back-to-top {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 48px;
    height: 48px;
    background: #059669;
    color: white;
    border: none;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(5,150,105,0.4);
    z-index: 999;
    transition: transform 0.2s;
    animation: fadeIn 0.3s ease;
  }
  .back-to-top:hover { transform: scale(1.1); }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>
