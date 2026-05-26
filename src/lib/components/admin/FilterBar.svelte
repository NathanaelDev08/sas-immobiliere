<script>
  let activeTab = 'Tous';
  const tabs = [
    { label: 'Tous', count: 76 },
    { label: 'Disponibles', count: 34 },
    { label: 'Occupés', count: 28 },
    { label: 'En travaux', count: 14 }
  ];
</script>

<div class="filter-bar">
  <!-- Tabs -->
  <div class="tabs">
    {#each tabs as tab}
      <button
        class="tab"
        class:active={activeTab === tab.label}
        on:click={() => activeTab = tab.label}
      >
        {tab.label}
        <span class="count" class:count-active={activeTab === tab.label}>
          {tab.count}
        </span>
      </button>
    {/each}
  </div>

  <!-- Search + Filters -->
  <div class="search-row">
    <div class="search-input">
      <span class="search-icon">🔍</span>
      <input type="text" placeholder="Rechercher par ID, propriétaire, ville..." />
    </div>
    <button class="filter-btn">
      <span>⚙️</span> Filtres
    </button>
    <button class="filter-btn">
      <span>▼</span> Type de bien
    </button>
  </div>
</div>

<style>
  .filter-bar { margin-bottom: 1.5rem; }

  .tabs {
    display: flex;
    gap: 0.25rem;
    border-bottom: 1px solid #e2e8f0;
    margin-bottom: 0.75rem;
  }
  .tab {
    padding: 0.6rem 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #64748b;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.15s;
  }
  .tab:hover { color: #334155; }
  .tab.active {
    color: #059669;
    border-bottom-color: #059669;
  }
  .count {
    margin-left: 0.4rem;
    font-size: 0.75rem;
    padding: 0.1rem 0.4rem;
    border-radius: 999px;
    background: #f1f5f9;
    color: #64748b;
  }
  .count-active {
    background: #d1fae5;
    color: #059669;
  }

  .search-row { display: flex; gap: 0.5rem; align-items: center; }
  .search-input {
    flex: 1;
    position: relative;
  }
  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.875rem;
  }
  .search-input input {
    width: 100%;
    padding: 0.6rem 0.75rem 0.6rem 2.5rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.875rem;
    background: white;
    box-sizing: border-box;
  }
  .search-input input:focus {
    outline: none;
    border-color: #059669;
    box-shadow: 0 0 0 3px rgba(5,150,105,0.1);
  }
  .filter-btn {
    padding: 0.6rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: white;
    font-size: 0.875rem;
    color: #475569;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.4rem;
    white-space: nowrap;
  }
  .filter-btn:hover { background: #f8fafc; }
</style>
