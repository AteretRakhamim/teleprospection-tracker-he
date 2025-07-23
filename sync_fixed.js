/**
 * sync_fixed.js - Synchronisation bidirectionnelle Google Sheets
 * Usage: Place <script src="sync_fixed.js"></script> juste avant </body> de vos pages HTML.
 * Ce script :
 *  - Parse le CSV renvoyé par doGet
 *  - Envoie en POST en x-www-form-urlencoded (simple request) pour éviter le pré-vol CORS
 */

const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwjM9eNQlXaB1UDTpMpHqm9vNWJIkTuBbrbGaVf4ZIPAiVaHggit9xLO-pcaXUzCziN/exec';

async function chargerDepuisGoogleSheets() {
  try {
    const resp = await fetch(WEB_APP_URL);
    if (!resp.ok) throw new Error('GET failed: ' + resp.status);
    const text = await resp.text();
    const lignes = text.trim().split('\n');
    const entetes = lignes.shift().split(',');
    window.donnees = lignes.map(line => {
      const cols = line.split(',');
      const obj = {};
      entetes.forEach((h,i) => obj[h] = cols[i] || '');
      return obj;
    });
    if (typeof mettreAJourSelects === 'function') mettreAJourSelects();
    if (typeof mettreAJourAffichage === 'function') mettreAJourAffichage();
  } catch (e) {
    console.error('Erreur lecture Sheets:', e);
  }
}

async function envoyerVersGoogleSheets(data) {
  try {
    // Simple X-WWW-FORM-URLENCODED request to avoid preflight
    const formData = new URLSearchParams();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    const resp = await fetch(WEB_APP_URL, {
      method: 'POST',
      body: formData
    });
    if (!resp.ok) throw new Error('POST failed: ' + resp.status);
    return await resp.json();
  } catch (e) {
    console.error('Erreur écriture Sheets:', e);
  }
}

function ajouterEntree() {
  const telepros = document.getElementById('teleprospectrice').value
    || document.getElementById('nouvelleTeleprospectrice').value.trim();
  const nouvelle = {
    "Téléprospectrice":   telepros,
    "Date":               document.getElementById('date').value,
    "Heure début":        document.getElementById('heureDebut').value,
    "Heure fin":          document.getElementById('heureFin').value,
    "Nb d'appels":        document.getElementById('nbAppels').value,
    "Personnes jointes":  document.getElementById('nbPersonnesJointes').value,
    "Nb de dons":         document.getElementById('nbDons').value,
    "Montants":           document.getElementById('montantDons').value
  };
  envoyerVersGoogleSheets(nouvelle)
    .then(() => chargerDepuisGoogleSheets())
    .catch(console.error);
}

document.addEventListener('DOMContentLoaded', () => {
  chargerDepuisGoogleSheets();
});
