<script>
  const quittances = [
    { id: 'QTT-001', locataire: 'Amadou Koné', bien: 'VIL-158902NH', montant: 500000, date: '01/05/2026', statut: 'Payé' },
    { id: 'QTT-002', locataire: 'Fatou Traoré', bien: 'APP-672103KL', montant: 350000, date: '05/05/2026', statut: 'Payé' },
    { id: 'QTT-003', locataire: 'Issa Ouattara', bien: 'COM-982345RT', montant: 150000, date: '01/05/2026', statut: 'Impayé' },
    { id: 'QTT-004', locataire: 'Mariam Bamba', bien: 'VIL-772190MH', montant: 800000, date: '01/05/2026', statut: 'Payé' },
  ];

  const totalPaye = quittances.filter(q => q.statut === 'Payé').reduce((s, q) => s + q.montant, 0);
  const totalImpaye = quittances.filter(q => q.statut === 'Impayé').reduce((s, q) => s + q.montant, 0);
</script>

<div class="page">
  <div class="top-bar">
    <div>
      <h1>Quittances & Taxes</h1>
      <p class="subtitle">Suivi financier</p>
    </div>
  </div>

  <div class="kpi-row">
    <div class="kpi">
      <p class="kpi-label">Total perçu</p>
      <p class="kpi-value green">{totalPaye.toLocaleString()} FCFA</p>
    </div>
    <div class="kpi">
      <p class="kpi-label">En attente</p>
      <p class="kpi-value red">{totalImpaye.toLocaleString()} FCFA</p>
    </div>
    <div class="kpi">
      <p class="kpi-label">Taxes mensuelles</p>
      <p class="kpi-value">187 500 FCFA</p>
    </div>
  </div>

  <div class="table-container">
    <table>
      <thead>
        <tr>
          <th>Référence</th>
          <th>Locataire</th>
          <th>Bien</th>
          <th>Montant</th>
          <th>Date</th>
          <th>Statut</th>
        </tr>
      </thead>
      <tbody>
        {#each quittances as q}
          <tr>
            <td><strong>{q.id}</strong></td>
            <td>{q.locataire}</td>
            <td>{q.bien}</td>
            <td><strong>{q.montant.toLocaleString()} FCFA</strong></td>
            <td>{q.date}</td>
            <td>
              <span class="status {q.statut === 'Payé' ? 'paid' : 'unpaid'}">{q.statut}</span>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>

<style>
  .page { max-width: 100%; }
  .top-bar { margin-bottom: 1.5rem; }
  h1 { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0; }
  .subtitle { color: #94a3b8; font-size: 0.875rem; margin: 0.25rem 0 0; }

  .kpi-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
  .kpi { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 1.25rem; }
  .kpi-label { color: #94a3b8; font-size: 0.8rem; margin: 0 0 0.25rem; }
  .kpi-value { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin: 0; }
  .kpi-value.green { color: #059669; }
  .kpi-value.red { color: #dc2626; }

  .table-container { background: white; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 1rem; font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; background: #f8fafc; border-bottom: 1px solid #e2e8f0; }
  td { padding: 1rem; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #334155; }
  .status { padding: 0.2rem 0.6rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
  .status.paid { background: #d1fae5; color: #065f46; }
  .status.unpaid { background: #fee2e2; color: #991b1b; }
</style>
