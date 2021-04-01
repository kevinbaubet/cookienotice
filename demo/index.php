<?php
require_once '../src/CookieNotice/Config.php';
require_once '../src/CookieNotice/Service.php';

/*

// Test

if (\CookieNotice\Service::isAllowed('facebook')) {
    // OK
}

// or

$state = \CookieNotice\Service::getState('facebook');
if ($state === true) {
    // OK
}

// Saved consent?
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

        <script src="https://unpkg.com/jquery@3.6.0/dist/jquery.js"></script>

        <script src="../src/cookienotice.js"></script>
        <script>
            jQuery(document).ready(function ($) {
                let cookieNotice = $('#notice-cookie').cookieNotice({
                    onChangeState: function () {
                        //console.log(this);
                    }
                });

                $('[data-cookienotice-service="youtube"]').on('agree.cookienotice', function (event, data) {
                    console.log(data);
                });

                $('#notice-cookie').on('changestate.cookienotice', function (event, data) {
                    console.log(data);
                });

                // Test
                // console.log(cookieNotice.isAllowed('facebook'));
                // or
                // let state = cookieNotice.getState('facebook');
                // console.log((state === true));
                // or
                // console.log(($.CookieNotice.services['facebook'] === true));

                // Saved consent?
                // console.log(cookieNotice.hasConsent());
            });
        </script>
    </head>
    <body>
        <div class="page">
            <h1>Cookie Notice</h1>

            <h2>Featuring</h2>
            <p>
                <b>First step:</b> a notice is displayed to inform the user of cookies for a listing of services. The choice is mandatory to continue the navigation.<br />
                <br />
                <b>Second step:</b> a choice is made if the user:<br />
                - clicks on the notice button "I accept", which will accept all cookies<br />
                - clicks on the notice button "I deny", which will deny all cookies<br />
                - clicks on the notice button "I customize", to customize the services one by one<br />
                - clicks on the service button "Allow" after deny all services, which will accept only the wanted service<br />
                <br />
                <b>Third step:</b> the deposit of one cookie to save user consent:<br />
                - for a maximum duration of 13 months<br />
                - there is a possibility of changing to return to customized services<br />
            </p>
            <p>&nbsp;</p>

            <h2>Change your mind</h2>
            <p>
                <a href="#" class="cookienotice-customize">Customize the cookies</a>
            </p>
            <p>&nbsp;</p>

            <h2>Allow a service during navigation</h2>

            <div class="services">
                <a data-cookienotice data-cookienotice-service="youtube" class="service" href="#">
                    <span>Youtube 1</span>
                </a>
                <a data-cookienotice data-cookienotice-service="youtube" class="service" href="#">
                    <span>Youtube 2</span>
                </a>
                <a data-cookienotice data-cookienotice-service="vimeo" class="service" href="#">
                    <span>Vimeo</span>
                </a>
                <a data-cookienotice data-cookienotice-service="googlemaps" class="service" href="#">
                    <span>Google Maps</span>
                </a>
                <a data-cookienotice data-cookienotice-service="recaptcha" class="service" href="#">
                    <span>reCAPTCHA</span>
                </a>
                <a data-cookienotice data-cookienotice-service="twitter" class="service" href="#">
                    <span>Twitter</span>
                </a>
            </div>
        </div>

        <div id="notice-cookie" data-config="<?php echo htmlspecialchars(\CookieNotice\Config::get()); ?>"></div>
    </body>
</html>