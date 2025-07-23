/**
 * sync.js - Synchronisation bidirectionnelle Google Sheets
 * Usage: Place <script src="sync.js"></script> juste avant </body> de vos pages HTML.
 */

// URL de votre Web App Apps Script
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwjM9eNQlXaB1UDTpMpHqm9vNWJIkTuBbrbGaVf4ZIPAiVaHggit9xLO-pcaXUzCziN/exec';

async function chargerDepuisGoogleSheets() {
  try {
    const resp = await fetch(WEB_APP_URL);
    if (!resp.ok) throw new Error('GET failed: ' + resp.status);
    const data = await resp.json();  // API JSON renvoyant un array d'objets
    window.donnees = data;
    if (typeof mettreAJourSelects   === 'function') mettreAJourSelects();
    if (typeof mettreAJourAffichage === 'function') mettreAJourAffichage();
  } catch (e) {
    console.error('Erreur lecture Sheets:', e);
  }
}

async function envoyerVersGoogleSheets(data) {
  try {
    const resp = await fetch(WEB_APP_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!resp.ok) throw new Error('POST failed: ' + resp.status);
    return await resp.json();
  } catch (e) {
    console.error('Erreur écriture Sheets:', e);
  }
}

function ajouterEntree() {
  // Exemple d'objet à envoyer, adaptez les IDs à vos champs
  const nouvelle = {
    "Téléprospectrice":   document.getElementById('teleprospectrice').value || document.getElementById('nouvelleTeleprospectrice').value.trim(),
    "Date":               document.getElementById('date').value,
    "Heure début":        document.getElementById('heureDebut').value,
    "Heure fin":          document.getElementById('heureFin').value,
    "Nb d'appels":        document.getElementById('nbAppels').value,
    "Personnes jointes":  document.getElementById('nbPersonnesJointes').value,
    "Nb de dons":         document.getElementById('nbDons').value,
    "Montants":           document.getElementById('montantDons').value,
  };
  envoyerVersGoogleSheets(nouvelle)
    .then(() => chargerDepuisGoogleSheets())
    .catch(console.error);
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
  chargerDepuisGoogleSheets();
});
