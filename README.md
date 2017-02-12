# Documentation CookieNotice

Ce script permet d'afficher une notice pour informer l'utilisation des cookies pour une liste de services.

## Initialisation

    $('#notice').cookieNotice([options]);


## Options

| Option             | Type     | Valeur par défaut                                           | Description                                                            |
|--------------------|----------|-------------------------------------------------------------|------------------------------------------------------------------------|
| button             | function | function(element) { return element.find('button'); }        | Fonction retournant le bouton d'acceptation dans l'élément de contexte |
| link               | function | function(body) { return body.find('a[target!="_blank"]'); } | Fonction retournant tous les liens internes du site                    |
| classOpen          | string   | 'is-cookieNoticeOpen'                                       | Nom de la classe si la notice est affichée                             |
| cookieName         | string   | 'cookienotice-agree'                                        | Nom du cookie déposé pour enregistrer le consentement                  |
| cookieDuration     | integer  | 13*30                                                       | Durée d'enregistrement du cookie du consentement                       |
| afterEventsHandler | function | undefined                                                   | Callback après la déclaration des événements                           |
| onAgree            | function | undefined                                                   | Callback à l'acceptation des cookies                                   |
| onDisagree         | function | undefined                                                   | Callback au refus des cookies                                          |