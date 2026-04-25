function calculerAge() {
  // Récupérer les valeurs des champs
  var jour = document.getElementById('day').value.trim();
  var mois = document.getElementById('month').value.trim();
  var annee = document.getElementById('year').value.trim();

  // Réinitialiser les erreurs avant de valider
  resetErrors();

  // Valider les champs
  var estValide = validerChamps(jour, mois, annee);

  // calcule
  if (estValide) {
    var resultat = calculDifference(parseInt(jour), parseInt(mois), parseInt(annee));
    afficherResultat(resultat.years, resultat.months, resultat.days);
  }
}
  // validzr les champs
function validerChamps(jour, mois, annee) {
  var valide = true;
  var today = new Date();

  // Vérifier si les champs sont vides
  if (jour === '') {
    afficherErreur('day', 'This field is required');
    valide = false;
  }
  if (mois === '') {
    afficherErreur('month', 'This field is required');
    valide = false;
  }
  if (annee === '') {
    afficherErreur('year', 'This field is required');
    valide = false;
  }

  // Si un champ est vide on arrête là
  if (!valide) return false;

  var j = parseInt(jour);
  var m = parseInt(mois);
  var a = parseInt(annee);

  // Vérifier le jour
  if (j < 1 || j > 31) {
    afficherErreur('day', 'Must be a valid day');
    valide = false;
  }

  // Vérifier le mois
  if (m < 1 || m > 12) {
    afficherErreur('month', 'Must be a valid month');
    valide = false;
  }

  // Vérifier l'année (pas dans le futur)
  if (a > today.getFullYear()) {
    afficherErreur('year', 'Must be in the past');
    valide = false;
  }

  // Si déjà des erreurs on arrête
  if (!valide) return false;

  // Vérifier si la date existe vraiment (ex: 31 avril n'existe pas)
  var dateTest = new Date(a, m - 1, j);
  if (
    dateTest.getFullYear() !== a ||
    dateTest.getMonth() !== m - 1 ||
    dateTest.getDate() !== j
  ) {
    afficherErreur('day', 'Must be a valid date');
    valide = false;
  }

  // Vérifier que la date n'est pas dans le futur
  var dateSaisie = new Date(a, m - 1, j);
  if (dateSaisie > today) {
    afficherErreur('year', 'Must be in the past');
    valide = false;
  }

  return valide;
}

// Calcul de la différence de dates
function calculDifference(jour, mois, annee) {
  var today = new Date();
  var jourAujourdhui = today.getDate();
  var moisAujourdhui = today.getMonth() + 1; // getMonth() commence à 0
  var anneeAujourdhui = today.getFullYear();

  var diffAnnees = anneeAujourdhui - annee;
  var diffMois = moisAujourdhui - mois;
  var diffJours = jourAujourdhui - jour;

  // Ajuster si les jours sont négatifs
  if (diffJours < 0) {
    diffMois--;
    // Nombre de jours dans le mois précédent
    var moisPrecedent = new Date(anneeAujourdhui, moisAujourdhui - 1, 0);
    diffJours += moisPrecedent.getDate();
  }

  // Ajuster si les mois sont négatifs
  if (diffMois < 0) {
    diffAnnees--;
    diffMois += 12;
  }

  return {
    years: diffAnnees,
    months: diffMois,
    days: diffJours
  };
}


// Afficher le résultat avec animation
function afficherResultat(annees, mois, jours) {
  animerNombre('result-years', annees);
  animerNombre('result-months', mois);
  animerNombre('result-days', jours);
}

// Animation compteur de 0 jusqu'au nombre final
function animerNombre(elementId, valeurFinale) {
  var element = document.getElementById(elementId);
  var duree = 2000; // 1 seconde
  var debut = 0;
  var increment = Math.ceil(valeurFinale / 20); // vitesse
  var actuel = 0;

  var timer = setInterval(function() {
    actuel += increment;
    if (actuel >= valeurFinale) {
      actuel = valeurFinale;
      clearInterval(timer);
    }
    element.textContent = actuel;
  }, duree / 20);
}

// Fonctions utilitaires pour les erreurs
function afficherErreur(champ, message) {
  var input = document.getElementById(champ);
  var label = document.getElementById('label-' + champ);
  var erreur = document.getElementById('error-' + champ);

  input.classList.add('error');
  label.classList.add('error');
  erreur.textContent = message;
}

function resetErrors() {
  var champs = ['day', 'month', 'year'];

  champs.forEach(function(champ) {
    var input = document.getElementById(champ);
    var label = document.getElementById('label-' + champ);
    var erreur = document.getElementById('error-' + champ);

    input.classList.remove('error');
    label.classList.remove('error');
    erreur.textContent = '';
  });

  // Remettre les tirets si on re-valide
  // (on ne touche pas aux résultats ici, seulement en cas de succès)
}

// Permettre de lancer avec la touche Enter
document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    calculerAge();
  }
});
