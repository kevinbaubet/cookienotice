<?php

namespace CookieNotice;

/**
 * Class Service
 *
 * @package CookieNotice
 */
abstract class Service {

    /**
     * Return true if the service is allowed
     *
     * @param $service
     * @return boolean
     */
    public static function isAllowed($service): bool {
        return self::getState($service) === true;
    }

    /**
     * Return the state of service. If there is no choice, the returned state is "undefined"
     *
     * @param $service
     * @return boolean|string
     */
    public static function getState($service) {
        if (self::hasConsent()) {
            $services = json_decode($_COOKIE['cookienotice'], true);

            if (isset($services[$service])) {
                return $services[$service];
            }
        }

        return 'undefined';
    }

    /**
     * Return true if there is a saved consent
     *
     * @return boolean
     */
    public static function hasConsent(): bool {
        return isset($_COOKIE['cookienotice']);
    }

}