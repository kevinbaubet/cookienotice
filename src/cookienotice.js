/**
 * CookieNotice
 *
 * Permet d'afficher une notice sur les cookies
 *
 * @version 2.0 (04/01/2017)
 */
(function($) {
    'use strict';

    $.CookieNotice = function(element, options) {
        // Config
        $.extend((this.settings = {}), $.CookieNotice.defaults, options);

        // Élements
        this.elements = {
            body: $('body'),
            notice: element,
            button: this.settings.button,
            link: this.settings.link
        };

        // Init
        this.load();
    };

    $.CookieNotice.defaults = {
        button: function(element) {
            return element.find('button');
        },
        link: function(body) {
            return body.find('a[target!="_blank"]');
        },
        classOpen: 'is-cookieNoticeOpen',
        cookieName: 'cookienotice-agree',
        cookieDuration: 13*30, // 13 mois, durée max pour stocker le consentement
        afterEventsHandler: undefined,
        onAgree: undefined,
        onDisagree: undefined
    };

    $.CookieNotice.agree = false;

    $.CookieNotice.prototype = {
        /**
         * Initialisation
         */
        load: function() {
            if (this.elements.notice.length === 0) {
                return false;
            }

            // Les cookies ne sont pas acceptés par défaut
            if (this.getCookie(this.settings.cookieName) === 'true') {
                $.CookieNotice.agree = true;
            } else {
                this.disagree();
            }
        },

        /**
         * Accepte les cookies
         */
        agree: function() {
            // Variable globale
            $.CookieNotice.agree = true;

            // État
            this.elements.body.removeClass(this.settings.classOpen);

            // Ajout d'un cookie pour acceptation
            this.setCookie(this.settings.cookieName, true, this.settings.cookieDuration);

            // Suppression des events
            this.removeEvents();

            // User callback
            if (this.settings.onAgree !== undefined) {
                this.settings.onAgree.call({
                    CookieNotice: this,
                    body: this.elements.body
                });
            }
        },

        /**
         * Refuse les cookies
         */
        disagree: function() {
            // Variable globale
            $.CookieNotice.agree = false;

            // État
            this.elements.body.addClass(this.settings.classOpen);

            // Suppression du cookie s'il existe
            if (this.getCookie(this.settings.cookieName) === 'true') {
                this.setCookie(this.settings.cookieName, '', -1);
            }

            // User callback
            if (this.settings.onDisagree !== undefined) {
                this.settings.onDisagree.call({
                    CookieNotice: this,
                    body: this.elements.body
                });
            }

            // Déclenchement des events pour accepter les cookies
            this.eventsHandler();
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function() {
            var self = this;

            // Bouton "ok"
            self.elements.button(self.elements.notice).one('click.cookienotice.button', function() {
                self.agree();
            });

            // Lien dans le site
            self.elements.link(self.elements.body).not(self.elements.notice.find('a')).one('click.cookienotice.link', function() {
                self.agree();
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    CookieNotice: self,
                    elements: self.elements
                });
            }
        },

        /**
         * Suppression des événements déclenchés
         */
        removeEvents: function() {
            this.elements.button(this.elements.notice).off('click.cookienotice.button');
            this.elements.link(this.elements.body).off('click.cookienotice.link');
        },

        /**
         * Utils get/set cookie
         */
        getCookie: function(name) {
            var regex = new RegExp('(?:; )?' + name + '=([^;]*);?');

            return (regex.test(document.cookie)) ? decodeURIComponent(RegExp['$1']) : null;
        },
        setCookie: function(name, value, duration) {
            var today = new Date();
            var expires = new Date();

            expires.setTime(today.getTime() + (duration*24*60*60*1000));
            document.cookie = name + '=' + value + ';expires=' + expires.toGMTString() + ';path=/;';
        }
    };

    $.fn.cookieNotice = function(options) {
        if (!navigator.cookieEnabled) {
            return false;
        }

        return new $.CookieNotice($(this), options);
    };
})(jQuery);