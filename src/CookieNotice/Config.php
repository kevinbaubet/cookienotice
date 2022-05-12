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
                    <p class="cookienotice-modal-label">We respect your privacy</p>
                    <p>We use non-sensitive data such as cookies to ensure the optimal functioning of the site and to compile audience statistics. Click on the "{agree}" button to give your consent to these operations and enjoy a personalized experience. Click on "{disagree}" to refuse them or modify your preferences by clicking on "{customize}".</p>
                ',
                'summary' => '
                    <p class="cookienotice-modal-label">We respect your privacy</p>
                    <p>We use non-sensitive data such as cookies to ensure the optimal functioning of the site and to carry out audience statistics ... (see more)</p>
                ',
                'agree' => 'Accept all',
                'disagree' => 'Continue without accepting',
                'customize' => 'Configure cookies'
            ],

            /**
             * (optional) Modal configuration to customize services
             *
             * - label       Modal title
             * - labelTag    (optional) Tag used for modal titles. If hN, the subtitles will be increase automatically
             * - description (optional) Modal description
             * - close       Button label to close modal
             */
            //
            'modal' => [
                'label' => 'Privacy preference center',
                'labelTag' => 'p',
                'description' => '<p>When you visit a website, data may be stored in your browser in the form of cookies. This information may relate to you, your preferences or your device and is used to ensure that the website is functioning properly. The information does not identify you directly, but gives you a personalized experience. Because we respect your right to privacy, we give you the possibility to manage cookies.</p>',
                'close' => 'Close'
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
                    'label' => 'Preferences for all services',
                    'customize' => 'I choose',
                    'agree' => 'Accept the service',
                    'disagree' => 'Decline the service',
                    'disabled' => 'The service {service} is disabled.',
                    'allow' => 'Authorize {service}',
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