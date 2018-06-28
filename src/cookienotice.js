(function ($) {
    'use strict';

    $.CookieNotice = function (container, options) {
        // Config
        $.extend((this.settings = {}), $.CookieNotice.defaults, options);

        // Élements
        this.elements = {
            body: $('body'),
            container: container
        };
        this.elements.siteLinks = this.settings.siteLinks(this.elements.body);

        // Variables
        this.config = this.elements.container.attr('data-config');
        this.cookieName = 'cookienotice';

        // Init
        if (this.prepareOptions()) {
            return this.load();
        }

        return false;
    };

    $.CookieNotice.defaults = {
        siteLinks: function (body) {
            return body.find('a[target!="_blank"]');
        },
        classes: {
            prefix: 'cookienotice',
            notice: 'notice notice--cookie',
            noticeOpen: 'is-{prefix}-notice-open',
            modal: 'modal modal--cookie',
            modalOpen: 'is-{prefix}-modal-open',
            btnAgree: '{prefix}-agree',
            btnCustomize: '{prefix}-customize',
            active: 'is-active'
        },
        cookieDuration: 13*30, // 13 mois, durée max pour stocker le consentement
        afterEventsHandler: undefined,
        onChangeState: undefined
    };

    $.CookieNotice.services = {};

    $.CookieNotice.prototype = {
        /**
         * Préparation des options utilisateur
         *
         * @return bool
         */
        prepareOptions: function () {
            // Cookies activés ?
            if (!navigator.cookieEnabled) {
                return false;
            }

            // Classes
            this.replacePrefixClass();

            // Éléments
            if (!this.elements.container.length) {
                this.setLog('Container element not found.', 'error');
                return false;
            }

            // Config
            if (this.config !== undefined && this.config !== '') {
                this.config = JSON.parse(this.config);

            } else {
                this.setLog('Attribute "data-config" not found in the container element.', 'error');
                return false;
            }

            return true;
        },

        /**
         * Initialisation
         */
        load: function () {
            this.wrapNotice();

            // Si les états des services n'ont pas pu être récupérés depuis le cookie, c'est qu'il n'y a pas eu encore le consentement
            if (!this.loadStates()) {
                this.setState('all', 'undefined');
                this.notice('show');
            }

            this.wrapModal();
            this.eventsHandler();

            return this;
        },

        /**
         * Wrapper et contenu de la notice
         */
        wrapNotice: function () {
            // Wrapper
            this.elements.noticeWrapper = $('<div>', {
                'class': this.settings.classes.notice
            });

            // Description
            if (this.config.notice.description !== undefined && this.config.notice.description !== '') {
                this.elements.noticeDescription = $('<p>', {
                    'class': this.settings.classes.prefix + '-notice-description',
                    html   : this.config.notice.description
                });

                if (this.config.notice.summary !== undefined && this.config.notice.summary !== '') {
                    this.elements.noticeDescription.attr('data-summary', this.config.notice.summary);
                }

                this.elements.noticeDescription.appendTo(this.elements.noticeWrapper);
            }

            // Actions
            this.elements.noticeActionsWrapper = $('<div>', {
                'class': this.settings.classes.prefix + '-notice-actions'
            });

            if (this.config.modal !== undefined && this.config.notice.customize !== undefined && this.config.notice.customize !== '') {
                var btnsCustomize = [];
                var btnCustomize = $('<button>', {
                    'class': this.settings.classes.btnCustomize,
                    html: this.config.notice.customize
                }).appendTo(this.elements.noticeActionsWrapper);
                var btnCustomizeInBody = this.elements.body.find('.' + this.settings.classes.btnCustomize);

                btnsCustomize.push(btnCustomize.get(0));
                if (btnCustomizeInBody.length) {
                    btnsCustomize.push(btnCustomizeInBody.get(0));
                }

                this.elements.btnCustomize = $(btnsCustomize);
            }
            if (this.config.notice.agree !== undefined && this.config.notice.agree !== '') {
                this.elements.btnAgree = $('<button>', {
                    'class': this.settings.classes.btnAgree,
                    html: this.config.notice.agree
                }).appendTo(this.elements.noticeActionsWrapper);
            }

            this.elements.noticeActionsWrapper.appendTo(this.elements.noticeWrapper);
            this.elements.noticeWrapper.appendTo(this.elements.container);

            return this;
        },

        /**
         * Show/hide notice
         *
         * @param action "show" ou "hide"
         */
        notice: function (action) {
            this.elements.body[((action === 'hide') ? 'remove' : 'add') + 'Class'](this.settings.classes.noticeOpen);
        },

        /**
         * Wrapper et contenu de la modale
         */
        wrapModal: function () {
            var self = this;

            if (self.config.modal !== undefined) {
                // Wrapper
                self.elements.modalWrapper = $('<div>', {
                    'class': self.settings.classes.modal
                });

                // Header
                self.elements.modalHeader = $('<div>', {
                    'class': self.settings.classes.prefix + '-modal-header'
                });

                if (self.config.modal.label !== undefined && self.config.modal.label !== '') {
                    $('<h1>', {
                        'class': self.settings.classes.prefix + '-modal-label',
                        html   : self.config.modal.label
                    }).appendTo(self.elements.modalHeader);
                }
                if (self.config.modal.description !== undefined && self.config.modal.description !== '') {
                    $('<p>', {
                        'class': self.settings.classes.prefix + '-modal-description',
                        html   : self.config.modal.description
                    }).appendTo(self.elements.modalHeader);
                }
                if (self.config.modal.close !== undefined && self.config.modal.close !== '') {
                    self.elements.modalClose = $('<button>', {
                        'class': self.settings.classes.prefix + '-modal-close',
                        html   : self.config.modal.close,
                    }).appendTo(self.elements.modalHeader);
                }

                self.elements.modalHeader.appendTo(self.elements.modalWrapper);

                // Services
                if (self.config.services !== undefined) {
                    var servicesByGroups = {};
                    $.each(this.config.services, function (service, options) {
                        if (service !== 'all') {
                            if (servicesByGroups[options.group] === undefined) {
                                servicesByGroups[options.group] = [];
                            }

                            servicesByGroups[options.group].push(service);
                        }
                    });

                    self.elements.servicesWrapper = $('<div>', {
                        'class': self.settings.classes.prefix + '-services'
                    });

                    // All
                    if (self.config.services.all !== undefined) {
                        self.elements.serviceAllWrapper = $('<div>', {
                            'class': self.settings.classes.prefix + '-service ' + self.settings.classes.prefix + '-service--all',
                            'data-service': 'all'
                        });

                        $('<h2>', {
                            'class': self.settings.classes.prefix + '-service-all-label',
                            html   : self.config.services.all.label
                        }).appendTo(self.elements.serviceAllWrapper);

                        self.wrapServiceActions('all').appendTo(self.elements.serviceAllWrapper);
                        self.elements.serviceAllWrapper.appendTo(self.elements.servicesWrapper);
                    }

                    // Groupe => Services
                    var groupsList = $('<ul>');
                    $.each(servicesByGroups, function (group, services) {
                        var groupWrapper = $('<li>', {
                            'class': self.settings.classes.prefix + '-group ' + self.settings.classes.prefix + '-group--' + group
                        }).appendTo(groupsList);

                        if (self.config.groups[group].label !== undefined && self.config.groups[group].label !== '') {
                            $('<h3>', {
                                html: self.config.groups[group].label
                            }).appendTo(groupWrapper);
                        }
                        if (self.config.groups[group].description !== undefined && self.config.groups[group].description !== '') {
                            $('<p>', {
                                html: self.config.groups[group].description
                            }).appendTo(groupWrapper);
                        }

                        if (services.length) {
                            var servicesList = $('<ul>');

                            $.each(services, function (i, service) {
                                var serviceWrapper = $('<li>', {
                                    'class': self.settings.classes.prefix + '-service ' + self.settings.classes.prefix + '-service--' + service,
                                    'data-service': service
                                });

                                var serviceLabel;
                                var serviceLabelAttributes = {
                                    'class': self.settings.classes.prefix + '-service-label',
                                    html: self.config.services[service].label
                                };
                                if (self.config.services[service].url !== undefined && self.config.services[service].url !== '') {
                                    serviceLabelAttributes['href'] = self.config.services[service].url;
                                    serviceLabel = $('<a>', serviceLabelAttributes);
                                } else {
                                    serviceLabel = $('<span>', serviceLabelAttributes);
                                }
                                serviceLabel.appendTo(serviceWrapper);

                                self.wrapServiceActions(service).appendTo(serviceWrapper);
                                serviceWrapper.appendTo(servicesList);
                            });

                            servicesList.appendTo(groupWrapper);
                        }
                    });

                    groupsList.appendTo(self.elements.servicesWrapper);
                    self.elements.servicesWrapper.appendTo(self.elements.modalWrapper);
                }

                self.elements.modalWrapper.appendTo(self.elements.container);

                // Overlay
                self.elements.modalOverlay = $('<div>', {
                    'class': self.settings.classes.prefix + '-modal-overlay'
                }).appendTo(self.elements.container);
            }

            return self;
        },

        /**
         * Wrapper des actions par service
         *
         * @param service
         */
        wrapServiceActions: function (service) {
            var self = this;
            var actions = $('<div>', {
                'class': this.settings.classes.prefix + '-service-actions'
            });

            $.each(['agree', 'disagree'], function (i, action) {
                if (self.config.services.all[action] !== undefined && self.config.services.all[action] !== '') {
                    var state = self.getState(service);
                    var isActive = (action === 'agree' && state === true || action === 'disagree' && state === false) ? ' ' + self.settings.classes.active : '';

                    if (service === 'all') {
                        var count = 0;
                        $.each($.CookieNotice.services, function (allService, allState) {
                             if (action === 'agree' && allState === true) {
                                 count++;
                             } else if (action === 'disagree' && allState === false) {
                                 count++;
                            }
                        });

                        if (count === Object.keys($.CookieNotice.services).length) {
                            isActive = ' ' + self.settings.classes.active;
                        }
                    }

                    $('<button>', {
                        'class': self.settings.classes.prefix + '-service-action ' + self.settings.classes.prefix + '-service-action--' + action + isActive,
                        'data-action': action,
                        html: self.config.services.all[action]
                    }).appendTo(actions);
                }
            });

            return actions;
        },

        /**
         * Show/hide modal
         *
         * @param action "show" ou "hide"
         */
        modal: function (action) {
            this.elements.body[((action === 'hide') ? 'remove' : 'add') + 'Class'](this.settings.classes.modalOpen);
        },

        /**
         * Gestionnaire d'événements
         */
        eventsHandler: function () {
            var self = this;

            // Bouton "ok"
            if (self.elements.btnAgree !== undefined && self.elements.btnAgree.length) {
                self.elements.btnAgree.one('click.cookienotice.btnAgree', function () {
                    self.agree();
                    self.notice('hide');

                    if (self.elements.serviceAction.length) {
                        self.elements.serviceAction.each(function (i, btn) {
                            btn = $(btn);
                            var btnAction = btn.attr('data-action');

                            if (btnAction === 'agree') {
                                btn.addClass(self.settings.classes.active);
                            }
                        });
                    }
                });
            }

            // Bouton "customize"
            if (self.elements.btnCustomize !== undefined && self.elements.btnCustomize.length) {
                self.elements.btnCustomize.on('click.cookienotice.btnCustomize', function (event) {
                    event.preventDefault();
                    self.modal('show');

                    if (!self.getCookie(self.cookieName)) {
                        self.notice('hide');
                    }
                });
            }

            // Modal
            if (self.config.modal !== undefined) {
                var closeModal = function (event) {
                    if (event.type === 'click' || (event.type === 'keydown' && event.keyCode === 27)) {
                        self.modal('hide');

                        if (!self.getCookie(self.cookieName)) {
                            self.notice('show');
                        }
                    }
                };

                // Close
                if (self.elements.modalClose.length) {
                    self.elements.modalClose.on('click.cookienotice.modalClose', closeModal);
                }

                // Overlay
                if (self.elements.modalOverlay.length) {
                    self.elements.modalOverlay.on('click.cookienotice.modalOverlay', closeModal);
                }

                // Escape
                $(document).on('keydown.cookienotice.modalEscape', closeModal);

                // States
                self.elements.serviceAction = self.elements.servicesWrapper.find('button.' + self.settings.classes.prefix + '-service-action');
                self.elements.serviceAction.on('click.cookienotice.serviceAction', function (event) {
                    var btn = $(event.currentTarget);
                    var action = btn.attr('data-action');
                    var serviceElement = btn.closest('.' + self.settings.classes.prefix + '-service');
                    var service = serviceElement.attr('data-service');

                    if (action !== undefined && service !== undefined) {
                        // Btn state
                        btn.siblings().removeClass(self.settings.classes.active);
                        btn.addClass(self.settings.classes.active);

                        if (service === 'all') {
                            self.elements.serviceAction.filter('[data-action="' + action + '"]').each(function (i, item) {
                                item = $(item);
                                item.siblings().removeClass(self.settings.classes.active);
                                item.addClass(self.settings.classes.active);
                            });
                        } else {
                            self.elements.serviceAllWrapper.find('button').removeClass(self.settings.classes.active);
                        }

                        // Service state
                        self.setState(service, (action === 'agree'));
                    }
                });
            }

            // Lien dans le site
            self.elements.siteLinks.not(self.elements.container.find('a')).not('.' + self.settings.classes.btnCustomize).one('click.cookienotice.siteLinks', function () {
                self.agree();
                self.notice('hide');
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
         * Accepte un service
         *
         * @param service
         */
        agree: function (service) {
            service = service || 'all';

            return this.setState(service, true);
        },

        /**
         * Refuse un service
         *
         * @param service
         */
        disagree: function (service) {
            service = service || 'all';

            return this.setState(service, false);
        },

        /**
         * Définition de l'état du service
         *
         * @param service
         * @param state
         */
        setState: function (service, state) {
            // Variables globales
            if (service === 'all' && this.config.services !== undefined) {
                $.each(this.config.services, function (configService, options) {
                    if (configService !== 'all') {
                        $.CookieNotice.services[configService] = state;
                    }
                });
            } else {
                $.CookieNotice.services[service] = state;
            }

            if (state !== 'undefined') {
                // Cookie
                this.setCookie(this.cookieName, JSON.stringify($.CookieNotice.services), this.settings.cookieDuration);

                // User callback
                if (this.settings.onChangeState !== undefined) {
                    this.settings.onChangeState.call({
                        cookieNotice: this,
                        services: $.CookieNotice.services,
                        service: service,
                        state: state
                    });
                }
            }

            return this;
        },

        /**
         * Chargement des états des services depuis le cookie
         *
         * @return false si le cookie n'existe pas ou object avec l'état de chaque service s'il existe
         */
        loadStates: function () {
            var states = this.getCookie(this.cookieName);

            if (states) {
                states = JSON.parse(states);

                $.each(states, function (service, state) {
                    $.CookieNotice.services[service] = state;
                });

                return states;
            }

            return false;
        },

        /**
         * Récupération de l'état du service. Si le choix n'a pas été fait, l'état retourné est "undefined"
         *
         * @param service
         * @return boolean|string
         */
        getState: function (service) {
            if ($.CookieNotice.services[service] !== undefined) {
                return $.CookieNotice.services[service];
            }

            return 'undefined';
        },

        /**
         * Détermine si un service est autorisé
         *
         * @param service
         * @return boolean
         */
        isAllowed: function (service) {
            return (this.getState(service) === true);
        },

        /**
         * Détermine si il y a eu un consentement (accepté ou non)
         *
         * @return boolean
         */
        hasConsent: function () {
            return (!!this.getCookie(this.cookieName));
        },

        /**
         * Utils
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
        },
        setLog: function (log, type) {
            type = type || 'log';

            console[type]('CookieNotice: ' + log);
        },
        replacePrefixClass: function () {
            var self = this;

            $.each(self.settings.classes, function (key, value) {
                if (typeof value === 'string') {
                    self.settings.classes[key] = value.replace(/{prefix}/, self.settings.classes.prefix);
                }
            });

            return self;
        }
    };

    $.fn.cookieNotice = function (options) {
        return new $.CookieNotice($(this), options);
    };
})(jQuery);