# Documentation CookieNotice

* Compatibilité : IE10+
* Dépendance : jQuery, PHP


## Principe de fonctionnement ([Rappel des obligations légales](https://www.cnil.fr/fr/exemple-de-bandeau-cookie))

**1ère étape** : une notice s'affiche pour informer l'utilisation des cookies pour une liste de services.

**2ème étape** : un choix est fait si l'utilisateur :
* clique sur le bouton de la notice "j'accepte", ce qui vaut pour acceptation de tous les cookies
* clique sur n'importe quel lien interne de la page et poursuit la navigation, ce qui vaut pour acceptation de tous les cookies
* personnalise les services un par un

**3ème étape** : dépôt d'un cookie pour enregistrer le consentement de l'utilisateur :
* pendant une durée maximum de 13 mois
* possiblité de changer d'avis en retournant sur la personnalisation des services


## Initialisation

    <?php require_once '../src/CookieNotice/Config.php'; // A configurer ?>
    <?php require_once '../src/CookieNotice/Service.php'; // Optionnel ?>
    
    <div id="notice-cookie" data-config="<?php echo \CookieNotice\Config::get(); ?>"></div>
    
    $('#notice-cookie').cookieNotice([options]);


## Côté PHP

### Configuration (obligatoire)

La configuration de **CookieNotice** se passe dans le fichier _CookieNotice/Config.php_ dans la méthode _Config::set()_.
C'est à vous de gérer la traduction en fonction de vos préférences.

___notice___ : Configuration du bandeau notice
* _description_ : Contenu de la notice
* _summary_ : Résumé de la notice affichée en version mobile
* _customize_ : Label du bouton pour personnaliser les services
* _agree_ : Label du bouton pour accepter tous les services
* _disagree_ : Label du bouton pour refuser tous les services
   
___modal___ : Configuration de la popup pour personnaliser les services. Commentez cette partie pour ne pas autoriser la personnalisation des services
* _label_ : Nom de la popup
* _description_ : Description de la popup (optionnel)
* _close_ : Nom du bouton de fermeture
    
___groups___ : Liste des groupes de services
* ___id___ : Identifiant du groupe (ex: "social")
    * _label_ : Nom du groupe
    * _description_ : Description du groupe (optionnel)
        
___services___ : Liste des services associés aux groupes
* ___id___ : Identifiant du service (ex: "facebook")
  * _label_ : Nom du service
  * _url_ : URL vers les termes d'utilisation/politique de confidentialité du service
  * _group_ : Identifiant du groupe à rattacher
      
      
### Méthodes

* namespace : **CookieNotice**
* classe    : **Service**
        
| Méthode            | Arguments                                                                                                                                                          | Description                                                                                       |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| getState           | **service** *string* Identifiant du service, exemple : "facebook"                                                                                                  | Récupération de l'état du service. Si le choix n'a pas été fait, l'état retourné est "undefined"  |                 
| isAllowed          | **service** *string* Identifiant du service, exemple : "facebook"                                                                                                  | Détermine si un service est autorisé                                                              |                 
| hasConsent         | -                                                                                                                                                                  | Détermine si il y a eu un consentement (accepté ou non)                                           |


### Tester les choix des services

    if (\CookieNotice\Service::isAllowed('facebook'))) {
        // OK
    }
    
    // ou
    
    $state = \CookieNotice\Service::getState('facebook');
    if ($state === true) {
        // OK
    }
    
    // Il y a-t-il un consentement enregistré ?
    if (\CookieNotice\Service::hasConsent()) {
        // OK
    }


## Côté JS

### Options

| Option                               | Type     | Valeur par défaut                                            | Description                                                                     |
|--------------------------------------|----------|--------------------------------------------------------------|---------------------------------------------------------------------------------|
| siteLinks                            | function | function (body) { return body.find('a[target!="_blank"]'); } | Fonction retournant tous les liens internes du site                             |
| classes                              | object   | Voir ci-dessous                                              | Objet pour les options ci-dessous                                               |
| &nbsp;&nbsp;&nbsp;&nbsp;prefix       | string   | 'cookienotice'                                               | Classe de préfix                                                                |
| &nbsp;&nbsp;&nbsp;&nbsp;notice       | string   | 'notice notice--cookie'                                      | Classe pour la notice                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;noticeOpen   | string   | 'is-{prefix}-notice-open'                                    | Classe pour la notice à l'état ouvert                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;modal        | string   | 'modal modal--cookie'                                        | Classe pour la modale                                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;modalOpen    | string   | 'is-{prefix}-modal-open'                                     | Classe pour la modale à l'état ouvert                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;btnAgree     | string   | '{prefix}-agree'                                             | Classe du bouton pour accepter (ex: 'btn btn--primary')                         |
| &nbsp;&nbsp;&nbsp;&nbsp;btnCustomize | string   | '{prefix}-customize'                                         | Classe du bouton pour personnaliser (ex: 'btn btn--secondary')                  |
| &nbsp;&nbsp;&nbsp;&nbsp;active       | string   | 'is-active'                                                  | Classe pour l'état actif d'un bouton                                            |
| reload                               | boolean  | false                                                        | Lors du consentement, un rechargement de la page est effectué                   |
| summary                              | int/bool | 767                                                          | Largeur max en px pour afficher le résumé de la notice. "false" pour désactiver |
| cookieDuration                       | integer  | 13*30                                                        | Durée d'enregistrement du cookie du consentement                                |
| afterWrapNotice                      | function | undefined                                                    | Callback après l'ajout de la notice dans la page                                |
| afterWrapModal                       | function | undefined                                                    | Callback après l'ajout de la modale dans la page                                |
| afterEventsHandler                   | function | undefined                                                    | Callback après la déclaration des événements                                    |
| onChangeState                        | function | undefined                                                    | Callback une fois le choix effectué                                             |


### Méthodes

| Méthode            | Arguments                                                                                                                                                          | Description                                                                                       |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| notice             | **action** *string* Action "show" ou "hide"                                                                                                                        | Show/hide notice                                                                                  |
| modal              | **action** *string* Action "show" ou "hide"                                                                                                                        | Show/hide modal                                                                                   |
| agree              | **service** *string* Identifiant du service, exemple : "facebook"                                                                                                  | Accepte un service                                                                                |
| disagree           | **service** *string* Identifiant du service, exemple : "facebook"                                                                                                  | Refuse un service                                                                                 |
| setState           | **service** *string* Identifiant du service, exemple : "facebook", **state** *mixed* true, false ou 'undefined' pour définir le choix du service                   | Définition de l'état du service                                                                   |
| loadStates         | -                                                                                                                                                                  | Chargement des états des services depuis le cookie                                                |
| getState           | **service** *string* Identifiant du service, exemple : "facebook"                                                                                                  | Récupération de l'état du service. Si le choix n'a pas été fait, l'état retourné est "undefined"  |                 
| isAllowed          | **service** *string* Identifiant du service, exemple : "facebook"                                                                                                  | Détermine si un service est autorisé                                                              |                 
| hasConsent         | -                                                                                                                                                                  | Détermine si il y a eu un consentement (accepté ou non)                                           |
| reload             | -                                                                                                                                                                  | Rechargement de la page                                                                           |
| getCookie          | **name** *string* Nom du cookie                                                                                                                                    | Récupération de la valeur d'un cookie                                                             |
| setCookie          | **name** *string* Nom du cookie, **value** *string* Valeur à écrire, **duration** *int* Nombre de jour avant expiration, **path** *string* Chemin de stokage       | Stocker une valeur dans cookie                                                                    |
| removeCookie       | **name** *string* Nom du cookie, **path** *string* Chemin de stokage                                                                                               | Supprimer un cookie                                                                               |
| destroy            | -                                                                                                                                                                  | Supprime CookieNotice de la page                                                                  |


### Tester les choix des services

    var cookieNotice = $('#notice-cookie').cookieNotice();
    
    if (cookieNotice.isAllowed('facebook')) {
        // OK
    }
    
    // ou

    var state = cookieNotice.getState('facebook');
    if (state === true) {
        // OK
    }
    
    // Il y a-t-il un consentement enregistré ?
    if (cookieNotice.hasConsent()) {
        // OK
    }