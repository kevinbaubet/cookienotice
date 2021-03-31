<?php

namespace CookieNotice;

/**
 * Class Config
 *
 * @package CookieNotice
 */
abstract class Config {

    /**
     * CookieNotice configuration
     *
     * @return array
     */
    public static function set(): array {
        return [
            /**
             * Notice configuration
             *
             * - description Notice contents
             * - summary     Summary of notice contents showed in mobile
             * - customize   Button label to customize services
             * - agree       Button label to accept all services
             * - disagree    Button label to deny all services
             */
            'notice' => [
                'description' => '
                    <h2 class="cookienotice-modal-label">Nous respectons votre vie privée</h2>
                    <p>Nous utilisons des données non sensibles comme des cookies pour assurer le fonctionnement optimal du site et réaliser des statistiques d’audience. Cliquez sur le bouton "{agree}" pour donner votre consentement à ces opérations et profiter d’une expérience personnalisée. Cliquez sur "{disagree}" pour les refuser ou modifiez vos préférences en cliquant sur "{customize}".</p>
                ',
                'summary' => '
                    <h2 class="cookienotice-modal-label">Nous respectons votre vie privée</h2>
                    <p>Nous utilisons des données non sensibles comme des cookies pour assurer le fonctionnement optimal du site et réaliser des statistiques d’audience... (voir plus)</p>
                ',
                'agree' => 'Tout accepter',
                'disagree' => 'Continuer sans accepter',
                'customize' => 'Paramétrer les cookies'
            ],

            /**
             * (optional) Modal configuration to customize services
             *
             * - label       Modal title
             * - labelTag    (optional) Tag used for modal title. If hN, the subtitles will be increase automatically
             * - description (optional) Modal description
             * - close       Button label to close modal
             */
            //
            'modal' => [
                'label' => 'Centre de préférences de la confidentialité',
                'labelTag' => 'h2',
                'description' => '<p>Lorsque vous consultez un site Web, des données peuvent être stockées dans votre navigateur sous la forme de cookies. Ces informations peuvent porter sur vous, sur vos préférences ou sur votre appareil et sont utilisées pour s\'assurer que le site Web fonctionne correctement. Les informations ne permettent pas de vous identifier directement, mais de vous faire bénéficier d\'une expérience personnalisée. Parce que nous respectons votre droit à la vie privée, nous vous donnons la possibilité gérer les cookies.</p>',
                'close' => 'Fermer'
            ],

            /**
             * Groups list of services
             *
             * By default: none
             * Add a group:
             *    group_id
             *      - label       Group title
             *      - description (optional) Group description
             */
            'groups' => [
                'none' => []
            ],

            /**
             * Services list associated to groups
             *
             * Add a service:
             *   service_id
             *      - label        Service title
             *      - descripition (optional) Service description
             *      - url          (optional) External Url to cookies privacy-policy
             *      - group        Associated group id
             */
            'services' => [
                /**
                 * ALL
                 *
                 * - label     Service title
                 * - customize Button label to customize service
                 * - agree     Button label to accept service
                 * - disagree  Button label to deny service
                 * - disabled  Text displayed if the service is disabled
                 * - allow     Button label to allow service under disabled text
                 * - position  Position of the line "all services": before, after or both
                 */
                'all' => [
                    'label' => 'Préférences pour tous les services',
                    'customize' => 'Je choisis',
                    'agree' => 'Accepter le service',
                    'disagree' => 'Refuser le service',
                    'disabled' => 'Le service {service} est désactivé.',
                    'allow' => 'Autoriser {service}',
                    'position' => 'both'
                ],

                // ANALYTICS
                'analytics' => [
                    'label' => 'Google Analytics',
                    'url' => 'https://support.google.com/analytics/answer/6004245',
                    'group' => 'none'
                ],
                'googletagmanager' => [
                    'label' => 'Google Tag Manager',
                    'url' => 'https://www.google.com/analytics/tag-manager/use-policy',
                    'group' => 'none'
                ],

                // APIs
                'googlemaps' => [
                    'label' => 'Google Maps',
                    'url' => 'https://developers.google.com/maps/terms',
                    'group' => 'none'
                ],
                'recaptcha' => [
                    'label' => 'reCAPTCHA',
                    'url' => 'https://policies.google.com/privacy',
                    'group' => 'none'
                ],

                // SOCIAL
                'facebook' => [
                    'label' => 'Facebook',
                    'url' => 'https://www.facebook.com/policies/cookies',
                    'group' => 'none'
                ],
                'twitter' => [
                    'label' => 'Twitter',
                    'url' => 'https://help.twitter.com/fr/rules-and-policies/twitter-cookies',
                    'group' => 'none'
                ],
                'linkedin' => [
                    'label' => 'LinkedIn',
                    'url' => 'https://www.linkedin.com/legal/cookie_policy',
                    'group' => 'none'
                ],

                // VIDEOS
                'youtube' => [
                    'label' => 'YouTube',
                    'url' => 'https://policies.google.com/privacy',
                    'group' => 'none'
                ],
                'vimeo' => [
                    'label' => 'Vimeo',
                    'url' => 'https://vimeo.com/privacy',
                    'group' => 'none'
                ]
            ]
        ];
    }

    /**
     * Récupération de la configuration en string JSON
     *
     * @return string
     */
    public static function get(): string {
        return json_encode(self::set(), JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT);
    }

}