<?php
require_once '../src/CookieNotice/Config.php';
require_once '../src/CookieNotice/Service.php';

/*

// Tester

if (\CookieNotice\Service::isAllowed('facebook'))) {
    // OK
}

// ou

$state = \CookieNotice\Service::getState('facebook');
if ($state === true) {
    // OK
}

// Consentement enregistré ?
if (\CookieNotice\Service::hasConsent()) {
    // OK
}

*/

?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>CookieNotice</title>
        <link rel="stylesheet" href="demo.css" />

        <link rel="stylesheet" href="../dist/cookienotice.css" />

        <script src="https://unpkg.com/jquery@3.5.1/dist/jquery.js"></script>

        <script src="../src/cookienotice.js"></script>
        <script>
            jQuery(document).ready(function ($) {
                var cookieNotice = $('#notice-cookie').cookieNotice();

                // Tester
                // console.log(cookieNotice.isAllowed('facebook'));
                // ou
                // var state = cookieNotice.getState('facebook');
                // console.log((state === true));
                // ou
                // console.log(($.CookieNotice.services['facebook'] === true));

                // Consentement enregistré ?
                // console.log(cookieNotice.hasConsent());
            });
        </script>
    </head>
    <body>
        <div class="page">
            <h1>Cookie Notice</h1>

            <h2>Ce que fait Cookie Notice (<a href="https://www.cnil.fr/fr/exemple-de-bandeau-cookie" target="_blank">Rappel des obligations légales</a>)</h2>
            <p>
                <b>1ère étape :</b> une notice s'affiche pour informer l'utilisation des cookies pour une liste de services.<br />
                <br />
                <b>2ème étape :</b> un choix est fait si l'utilisateur :<br />
                - clique sur le bouton de la notice "j'accepte", ce qui vaut pour acceptation de tous les cookies<br />
                - clique sur le bouton de la notice "je refuse", ce qui interdit l'installation de tous les cookies<br />
                - clique sur n'importe quel lien interne de la page et poursuit la navigation, ce qui vaut pour acceptation de tous les cookies<br />
                - personnalise les services un par un
                <br />
                <br />
                <b>3ème étape :</b> dépôt d'un cookie pour enregistrer le consentement de l'utilisateur :<br />
                - pendant une durée maximum de 13 mois<br />
                - possiblité de changer d'avis en retournant sur la personnalisation des services<br />
                <br />
            </p>

            <h2>Exemple comportant un lien</h2>
            <p>
                Lorem ipsum dolor sit amet, <a href="">cliquer sur ce lien permet d'accepter les cookies</a>. Nisi, et reiciendis ea corrupti accusamus? Maxime nostrum deserunt assumenda consequatur magnam ipsam beatae ad facilis tenetur, ratione voluptatum error dicta iusto?
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi, et reiciendis ea corrupti accusamus?
                <br />
            </p>
            <br />

            <h2>Changer d'avis</h2>
            <p>
                <a href="#" class="cookienotice-customize">Gestion des cookies</a>
            </p>
        </div>

        <div id="notice-cookie" data-config="<?php echo \CookieNotice\Config::get(); ?>"></div>
    </body>
</html>