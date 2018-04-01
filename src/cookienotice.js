(function ($) {
    'use strict';

    $.CookieNotice = function (notice, options) {
        // Config
        $.extend((this.settings = {}), $.CookieNotice.defaults, options);

        // Élements
        this.elements = {
            body: $('body'),
            notice: notice
        };
        this.elements.button = this.settings.button(this.elements.notice);
        this.elements.link = this.settings.link(this.elements.body);

        // Init
        return this.load();
    };

    $.CookieNotice.defaults = {
        button: function (element) {
            return element.find('button');
        },
        link: function (body) {
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
        load: function () {
            if (this.elements.notice.length === 0) {
                console.error('CookieNotice: jQuery element not found.');
                return false;
            }

            // Les cookies ne sont pas acceptés par défaut
            if (this.getCookie(this.settings.cookieName) === 'true') {
                $.CookieNotice.agree = true;
            } else {
                this.disagree();
            }

            return this;
        },

        /**
         * Accepte les cookies
         */
        agree: function () {
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
                    cookieNotice: this,
                    body: this.elements.body
                });
            }
        },

        /**
         * Refuse les cookies
         */
        disagree: function () {
            // Variable globale
            $.CookieNotice.agree = false;

            // État
            this.elements.body.addClass(this.settings.classOpen);

            // Suppression du cookie s'il existe
            if (this.getCookie(this.settings.cookieName) === 'true') {
                this.removeCookie(this.settings.cookieName);
            }

            // User callback
            if (this.settings.onDisagree !== undefined) {
                this.settings.onDisagree.call({
                    cookieNotice: this,
                    body: this.elements.body
                });
            }

            // Déclenchement des events pour accepter les cookies
            this.eventsHandler();

            return this;
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            // Bouton "ok"
            self.elements.button.one('click.cookienotice.button', function () {
                self.agree();
            });

            // Lien dans le site
            self.elements.link.not(self.elements.notice.find('a')).one('click.cookienotice.link', function () {
                self.agree();
            });

            // User callback
            if (self.settings.afterEventsHandler !== undefined) {
                self.settings.afterEventsHandler.call({
                    cookieNotice: self,
                    elements: self.elements
                });
            }

            return self;
        },

        /**
         * Suppression des événements déclenchés
         */
        removeEvents: function () {
            this.elements.button.off('click.cookienotice.button');
            this.elements.link.off('click.cookienotice.link');

            return this;
        },

        /**
         * Utils cookie
         */
        getCookie: function (name) {
            var regex = new RegExp('(?:; )?' + name + '=([^;]*);?');

            return (regex.test(document.cookie)) ? decodeURIComponent(RegExp['$1']) : null;
        },
        setCookie: function (name, value, duration, path) {
            var today = new Date();
            var expires = new Date();
            path = path || '/';

            expires.setTime(today.getTime() + (duration*24*60*60*1000));
            document.cookie = name + '=' + value + ';expires=' + expires.toGMTString() + ';path=' + path + ';';
        },
        removeCookie: function (name, path) {
            return this.setCookie(name, '', -1, path);
        }
    };

    $.fn.cookieNotice = function (options) {
        if (!navigator.cookieEnabled) {
            return false;
        }

        return new $.CookieNotice($(this), options);
    };
})(jQuery);