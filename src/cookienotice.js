(function ($) {
    'use strict';

    /**
     * CookieNotice
     *
     * @param {object} container
     * @param {object} options
     *
     * @return {$.CookieNotice}
     */
    $.CookieNotice = function (container, options) {
        // Config
        $.extend(true, this.settings = {}, $.CookieNotice.defaults, options);

        // Elements
        this.elements = {
            body: $('body'),
            container: container
        };

        // Variables
        this.config = this.elements.container.attr('data-config');
        this.cookieName = 'cookienotice';
        this.triggerTimeout = undefined;

        // Init
        if (this.prepareOptions()) {
            return this.init();
        }

        return this;
    };

    $.CookieNotice.defaults = {
        classes: {
            prefix: 'cookienotice',
            notice: 'notice notice--cookie',
            noticeOpen: 'is-{prefix}-notice-open',
            modal: 'modal modal--cookie',
            modalOpen: 'is-{prefix}-modal-open',
            serviceHandler: '{prefix}-service-handler',
            serviceAgreed: 'is-agreed',
            serviceDisagreed: 'is-disagreed',
            btnAgree: '{prefix}-agree',
            btnDisagree: '{prefix}-disagree',
            btnCustomize: '{prefix}-customize'
        },
        reload: false,
        summary: 767,
        cookieDuration: 13*30, // 13 months, the legal maximum duration
        tabindexStart: 0,
        afterWrapNotice: undefined,
        afterWrapModal: undefined,
        afterWrapServiceHandler: undefined,
        afterEventsHandler: undefined,
        onChangeState: undefined
    };

    $.CookieNotice.services = {};

    $.CookieNotice.prototype = {
        /**
         * Prepare user options
         *
         * @return {boolean}
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
        init: function () {
            this.wrapNotice();

            // Si les états des services n'ont pas pu être récupérés depuis le cookie, c'est qu'il n'y a pas eu encore le consentement
            if (!this.loadStates()) {
                this.setState('all', 'undefined');
                this.notice('show');
            }

            this.wrapModal();
            this.wrapServiceHandler();
            this.eventsHandler();

            return this;
        },

        /**
         * Destroy CookieNotice
         */
        destroy: function () {
            this.elements.container.remove();
            this.elements.body
                .removeClass(this.settings.classes.noticeOpen)
                .removeClass(this.settings.classes.modalOpen);

            return this;
        },

        /**
         * Build the notice contents
         */
        wrapNotice: function () {
            let btnsCustomize = [];
            let btnCustomizeInBody = null;
            let btnCustomize = null;

            // Wrapper
            this.elements.noticeWrapper = $('<div>', {
                'class': this.settings.classes.notice
            });

            // Description
            if (this.config.notice.description !== undefined && this.config.notice.description !== '') {
                this.elements.noticeDescription = $('<div>', {
                    'class': this.settings.classes.prefix + '-notice-description',
                    html: this.formatDescription(this.config.notice.description)
                });

                this.elements.noticeDescription.appendTo(this.elements.noticeWrapper);
            }

            // Actions
            this.elements.noticeActionsWrapper = $('<div>', {
                'class': this.settings.classes.prefix + '-notice-actions'
            });

            // Btn agree
            if (this.config.notice.agree !== undefined && this.config.notice.agree !== '') {
                this.elements.btnAgree = $('<button>', {
                    'class': this.settings.classes.prefix + '-btn ' + this.settings.classes.prefix + '-btn--primary ' + this.settings.classes.btnAgree,
                    html: $('<span>', {
                        html: this.config.notice.agree
                    })
                }).appendTo(this.elements.noticeActionsWrapper);
            }

            // Btn disagree
            if (this.config.notice.disagree !== undefined && this.config.notice.disagree !== '') {
                this.elements.btnDisagree = $('<button>', {
                    'class': this.settings.classes.prefix + '-btn ' + this.settings.classes.prefix + '-btn--secondary ' + this.settings.classes.btnDisagree,
                    html: $('<span>', {
                        html: this.config.notice.disagree
                    })
                }).appendTo(this.elements.noticeActionsWrapper);
            }

            // Btn customize
            if (this.config.modal !== undefined && this.config.notice.customize !== undefined && this.config.notice.customize !== '') {
                btnCustomize = $('<button>', {
                    'class': this.settings.classes.prefix + '-btn ' + this.settings.classes.prefix + '-btn--tertiary ' + this.settings.classes.btnCustomize,
                    html: $('<span>', {
                        html: this.config.notice.customize
                    })
                }).appendTo(this.elements.noticeActionsWrapper);

                btnCustomizeInBody = this.elements.body.find('.' + this.settings.classes.prefix + '-customize');
                btnsCustomize.push(btnCustomize.get(0));

                if (btnCustomizeInBody.length) {
                    btnsCustomize.push(btnCustomizeInBody.get(0));
                }

                this.elements.btnCustomize = $(btnsCustomize);
            }

            this.elements.noticeActionsWrapper.appendTo(this.elements.noticeWrapper);
            this.elements.noticeWrapper.appendTo(this.elements.container);

            // User callback
            if (this.settings.afterWrapNotice !== undefined) {
                this.settings.afterWrapNotice.call({
                    cookieNotice: this,
                    elements: this.elements
                });
            }

            return this;
        },

        /**
         * Show/hide notice
         *
         * @param {string} action "show" or "hide"
         */
        notice: function (action) {
            this.elements.body[(action === 'hide' ? 'remove' : 'add') + 'Class'](this.settings.classes.noticeOpen);

            return this;
        },

        /**
         * Build the modal contents
         */
        wrapModal: function () {
            let self = this;

            if (self.config.modal !== undefined) {
                // Wrapper
                self.elements.modalWrapper = $('<div>', {
                    'class': self.settings.classes.modal,
                    role: 'dialog',
                    tabindex: '-1'
                });

                // Header
                self.elements.modalHeader = $('<div>', {
                    'class': self.settings.classes.prefix + '-modal-header'
                });

                // Title
                if (self.config.modal.label !== undefined && self.config.modal.label !== '') {
                    $('<' + (self.config.modal.labelTag || 'p') + '>', {
                        'class': self.settings.classes.prefix + '-modal-label',
                        html: self.config.modal.label
                    }).appendTo(self.elements.modalHeader);

                    self.elements.modalWrapper.attr('aria-label', self.config.modal.label);
                }

                // Description
                if (self.config.modal.description !== undefined && self.config.modal.description !== '') {
                    $('<div>', {
                        'class': self.settings.classes.prefix + '-modal-description',
                        html: self.formatDescription(self.config.modal.description)
                    }).appendTo(self.elements.modalHeader);
                }

                // Btn close
                if (self.config.modal.close !== undefined && self.config.modal.close !== '') {
                    self.elements.modalClose = $('<button>', {
                        'class': self.settings.classes.prefix + '-modal-close',
                        html: $('<span>', {
                            'class': 'sr-only',
                            html: self.config.modal.close
                        })
                    }).appendTo(self.elements.modalHeader);
                }

                self.elements.modalHeader.appendTo(self.elements.modalWrapper);

                // Services
                self.wrapServices();
                self.elements.modalWrapper.appendTo(self.elements.container);

                // User callback
                if (self.settings.afterWrapModal !== undefined) {
                    self.settings.afterWrapModal.call({
                        cookieNotice: self,
                        elements: self.elements
                    });
                }
            }

            // Overlay
            self.elements.modalOverlay = $('<div>', {
                'class': self.settings.classes.prefix + '-modal-overlay'
            }).appendTo(self.elements.container);

            return self;
        },

        /**
         * Build the list of services in modal
         */
        wrapServices: function () {
            let self = this;

            if (self.config.services !== undefined) {
                let servicesByGroups = {};
                $.each(self.config.services, function (service, options) {
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

                let serviceLabelTag = self.config.modal.labelTag || 'p';
                if (serviceLabelTag.indexOf('h') !== -1) {
                    let serviceLabelTagLevel = parseInt(serviceLabelTag.substring(1));
                    serviceLabelTagLevel++;
                    serviceLabelTag = 'h' + serviceLabelTagLevel;
                }

                // All
                if (self.config.services.all !== undefined) {
                    self.elements.serviceAllWrapper = $('<div>', {
                        'class': self.settings.classes.prefix + '-service ' + self.settings.classes.prefix + '-service--all',
                        'data-service': 'all'
                    });

                    $('<' + serviceLabelTag + '>', {
                        'class': self.settings.classes.prefix + '-service-all-label',
                        html   : self.config.services.all.label
                    }).appendTo(self.elements.serviceAllWrapper);

                    self.wrapServiceActions('all').appendTo(self.elements.serviceAllWrapper);

                    if (self.config.services.all.position === 'before' || self.config.services.all.position === 'both') {
                        self.elements.serviceAllWrapper.appendTo(self.elements.servicesWrapper);
                    }
                }

                // Group => Services
                let groupsList = $('<ul>');
                let groupIndex = 0;
                let groupLength = Object.keys(servicesByGroups).length;
                $.each(servicesByGroups, function (group, services) {
                    let groupWrapper = $('<li>', {
                        'class': self.settings.classes.prefix + '-group ' + self.settings.classes.prefix + '-group--' + group
                    }).appendTo(groupsList);

                    if (self.config.groups[group].label !== undefined && self.config.groups[group].label !== '') {
                        $('<' + serviceLabelTag + '>', {
                            'class': self.settings.classes.prefix + '-group--label',
                            html: self.config.groups[group].label
                        }).appendTo(groupWrapper);
                    }
                    if (self.config.groups[group].description !== undefined && self.config.groups[group].description !== '') {
                        $('<p>', {
                            'class': self.settings.classes.prefix + '-group--description',
                            html: self.formatDescription(self.config.groups[group].description)
                        }).appendTo(groupWrapper);
                    }

                    if (services.length) {
                        let servicesList = $('<ul>');

                        $.each(services, function (i, service) {
                            let serviceWrapper = $('<li>', {
                                'class': self.settings.classes.prefix + '-service ' + self.settings.classes.prefix + '-service--' + service,
                                'data-service': service
                            });
                            let serviceLabelWrapper = $('<div>', {
                                'class': self.settings.classes.prefix + '-service-label-wrapper'
                            });

                            // Label
                            let serviceLabel;
                            let serviceLabelAttributes = {
                                'class': self.settings.classes.prefix + '-service-label',
                                html: self.config.services[service].label
                            };
                            if (self.config.services[service].url !== undefined && self.config.services[service].url !== '') {
                                serviceLabelAttributes['href'] = self.config.services[service].url;
                                serviceLabelAttributes['tabindex'] = self.settings.tabindexStart;
                                serviceLabel = $('<a>', serviceLabelAttributes);
                            } else {
                                serviceLabel = $('<span>', serviceLabelAttributes);
                            }
                            serviceLabel.appendTo(serviceLabelWrapper);

                            // Description
                            if (self.config.services[service].description !== undefined && self.config.services[service].description !== '') {
                                let serviceDescription = $('<p>', {
                                    'class': self.settings.classes.prefix + '-service-description',
                                    html: self.formatDescription(self.config.services[service].description)
                                });
                                serviceDescription.appendTo(serviceLabelWrapper);
                            }

                            // Last service
                            if (groupIndex === groupLength-1 && i === services.length-1) {
                                serviceWrapper.addClass('is-last');
                            }

                            serviceLabelWrapper.appendTo(serviceWrapper);
                            self.wrapServiceActions(service).appendTo(serviceWrapper);
                            serviceWrapper.appendTo(servicesList);
                        });

                        servicesList.appendTo(groupWrapper);
                    }

                    groupIndex++;
                });

                groupsList.appendTo(self.elements.servicesWrapper);

                if (self.config.services.all !== undefined && (self.config.services.all.position === 'after' || self.config.services.all.position === 'both')) {
                    if (self.config.services.all.position === 'both') {
                        let serviceAllAfter = self.elements.serviceAllWrapper.clone();
                        serviceAllAfter.appendTo(self.elements.servicesWrapper);
                        self.elements.serviceAllWrapper.push(serviceAllAfter);
                    } else {
                        self.elements.serviceAllWrapper.appendTo(self.elements.servicesWrapper);
                    }
                }

                self.elements.servicesWrapper.appendTo(self.elements.modalWrapper);
                self.elements.serviceAction = self.elements.servicesWrapper.find('.' + self.settings.classes.prefix + '-service-action');
            }
        },

        /**
         * Build the actions for a service in modal
         *
         * @param {string} service
         */
        wrapServiceActions: function (service) {
            let self = this;
            let actions = $('<div>', {
                'class': self.settings.classes.prefix + '-service-actions'
            });

            if (self.config.services.all['agree'] !== undefined && self.config.services.all['agree'] !== '' && self.config.services.all['disagree'] !== undefined && self.config.services.all['disagree'] !== '') {
                let state = self.getState(service);

                if (service === 'all') {
                    let count = 0;
                    let none = false;
                    $.each($.CookieNotice.services, function (allService, allState) {
                        if (allState === true) {
                            count++;
                        }
                        if (allState === 'undefined') {
                            none = true;
                        }
                    });

                    let checkedState = count === Object.keys($.CookieNotice.services).length;
                    state = none ? 'undefined' : (count > 0 && !checkedState ? 'undefined' : checkedState);
                }

                // Switch
                let serviceActionWrapper = $('<span>', {
                    'class': self.settings.classes.prefix + '-service-action ' + (state === 'undefined' ? '' : (state ? self.settings.classes.serviceAgreed : self.settings.classes.serviceDisagreed))
                });
                $('<span>', {
                    'class': self.settings.classes.prefix + '-service-action-input',
                    tabindex: self.settings.tabindexStart,
                    html: $('<input>', {
                        type: 'checkbox',
                        'class': self.settings.classes.prefix + '-service-action-input--checkbox',
                        id: self.settings.classes.prefix + '-service-action--' + service,
                        name: service,
                        value: state,
                        checked: state === true
                    })
                }).appendTo(serviceActionWrapper);
                $('<label>', {
                    for: self.settings.classes.prefix + '-service-action--' + service,
                    'class': self.settings.classes.prefix + '-service-action-label',
                    html: state === 'undefined' ? self.config.services.all.customize : self.config.services.all[!state ? 'disagree' : 'agree'],
                    'aria-hidden': true
                }).appendTo(serviceActionWrapper);

                serviceActionWrapper.appendTo(actions);
            }

            return actions;
        },

        /**
         * Show/hide modal
         *
         * @param {object} event Current event
         * @param {string} action "show" or "hide"
         */
        modal: function (event, action) {
            let self = this;

            if (event !== undefined) {
                // SHOW
                if (action === 'show' && (event.type === 'click' || event.type === 'keyup' && (event.key === 'Enter' || event.key === ' '))) {
                    // Don't trigger multiple events
                    if (self.triggerTimeout !== undefined) {
                        clearTimeout(self.triggerTimeout);
                    }

                    self.triggerTimeout = setTimeout(function () {
                        event.preventDefault();
                        self.elements.openBtn = $(event.currentTarget);
                        self.elements.body.addClass(self.settings.classes.modalOpen);

                        setTimeout(function () {
                            self.elements.modalWrapper.focus();
                        }, 100);

                        if (!self.getCookie(self.cookieName)) {
                            self.notice('hide');
                        }

                        // Btn close
                        if (self.elements.modalClose.length) {
                            self.elements.modalClose.on({
                                'click.cookienotice.modalClose': function (event) {
                                    self.modal(event, 'hide');
                                },
                                // Go to last service
                                'keydown.cookienotice.modalClose': function (event) {
                                    if (event.key === 'Tab' && event.shiftKey) {
                                        event.preventDefault();
                                        self.elements.servicesWrapper.find('.is-last .' + self.settings.classes.prefix + '-service-action-input').focus();
                                    }
                                }
                            });
                        }

                        // Overlay
                        if (self.elements.modalOverlay.length) {
                            self.elements.modalOverlay.one('click.cookienotice.modalOverlay', function (event) {
                                self.modal(event, 'hide');
                            });
                        }

                        // Escape
                        $(document).on('keydown.cookienotice.modalEscape', function (event) {
                            self.modal(event, 'hide');
                        });

                        // Services state action
                        self.elements.serviceAction.on('click.cookienotice.serviceAction keydown.cookienotice.serviceAction', function (event) {
                            let btn = $(event.currentTarget);
                            let serviceElement = btn.closest('.' + self.settings.classes.prefix + '-service');
                            if (event.key === ' ') {
                                event.preventDefault();
                            }

                            if (event.type === 'click' || event.type === 'keydown' && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
                                let input = btn.find('input');
                                let state = input.prop('checked');
                                let service = serviceElement.attr('data-service');

                                if (service !== undefined) {
                                    self.setState(service, !state);
                                }
                            }

                            // Repeat tabindex
                            if (event.type === 'keydown' && event.key === 'Tab' && !event.shiftKey && serviceElement.hasClass('is-last')) {
                                event.preventDefault();
                                self.elements.modalClose.focus();
                            }
                        });
                    }, 100);
                }

                // HIDE
                else if (action === 'hide' && (event.type === 'click' || (event.type === 'keydown' && event.key === 'Escape'))) {
                    self.elements.body.removeClass(self.settings.classes.modalOpen);

                    // Stop events
                    self.elements.modalClose.off('click.cookienotice.modalClose keydown.cookienotice.modalClose');
                    self.elements.modalOverlay.off('click.cookienotice.modalOverlay');
                    $(document).off('keydown.cookienotice.modalEscape');
                    self.elements.serviceAction.off('click.cookienotice.serviceAction keydown.cookienotice.serviceAction');

                    // Focus
                    if (!self.settings.reload && self.elements.openBtn !== undefined && self.elements.openBtn.length) {
                        event.preventDefault();
                        setTimeout(function () {
                            self.elements.openBtn.focus();
                        }, 100);
                    }

                    if (!self.getCookie(self.cookieName)) {
                        self.notice('show');
                    }

                    self.reload();
                }
            }
        },

        /**
         * Build the service handler
         */
        wrapServiceHandler: function () {
            let self = this;

            if (self.config.services.all['allow'] !== undefined && self.config.services.all['allow'] !== '') {
                self.elements.serviceHandlers = self.elements.body.find('[data-cookienotice]');

                if (self.elements.serviceHandlers.length) {
                    self.elements.serviceHandlers.each(function (index, handler) {
                        handler = $(handler);

                        if (!handler.hasClass(self.settings.classes.serviceHandler + '-container')) {
                            let service = handler.attr('data-cookienotice-service');

                            if (service !== undefined && self.config.services[service] !== undefined) {
                                let state = self.getState(service);
                                let serviceConfig = self.config.services[service];

                                handler.addClass(self.settings.classes.serviceHandler + '-container' + ' ' + (!state || state === 'undefined' ? self.settings.classes.serviceDisagreed : self.settings.classes.serviceAgreed));

                                // Content
                                let wrapper = $('<div>', {
                                    'class': self.settings.classes.serviceHandler,
                                    'aria-hidden': !(!state || state === 'undefined')
                                });

                                if (self.config.services.all.disabled !== undefined) {
                                    $('<p>', {
                                        'class': self.settings.classes.serviceHandler + '-label',
                                        html: self.config.services.all.disabled.replace('{service}', serviceConfig.label)
                                    }).appendTo(wrapper);
                                }
                                let btnHandler = $('<button>', {
                                    'class': self.settings.classes.serviceHandler + '-btn ' + self.settings.classes.prefix + '-btn ' + self.settings.classes.prefix + '-btn--secondary ',
                                    html: self.config.services.all['allow'].replace('{service}', serviceConfig.label)
                                }).appendTo(wrapper);

                                wrapper.appendTo(handler);

                                // Event
                                let userEvent = {
                                    cookieNotice: self,
                                    elements: self.elements,
                                    handler: handler,
                                    service: service
                                };

                                btnHandler.on('click', function () {
                                    self.agree(service);
                                    handler.trigger('agree.cookienotice', [userEvent]);
                                });

                                // User callback
                                if (self.settings.afterWrapServiceHandler !== undefined) {
                                    self.settings.afterWrapServiceHandler.call(userEvent);
                                }
                            }
                        }
                    });
                }
            }
        },

        /**
         * Events handler
         */
        eventsHandler: function () {
            let self = this;

            // Notice description
            if (self.settings.summary !== false && self.elements.noticeDescription.length && self.config.notice.summary !== undefined && self.config.notice.summary !== '' && $(window).width() <= self.settings.summary) {
                self.elements.noticeDescription.html(self.formatDescription(self.config.notice.summary));

                self.elements.noticeDescription.on('click', function (event) {
                    if (!$(event.target).is('a') && self.elements.noticeDescription.html() !== self.config.notice.description) {
                        self.elements.noticeDescription.html(self.formatDescription(self.config.notice.description));
                    }
                });
            }

            // Button Agree
            if (self.elements.btnAgree !== undefined && self.elements.btnAgree.length) {
                self.elements.btnAgree.one('click.cookienotice.btnAgree', function () {
                    self.agree();
                    self.notice('hide');
                    self.reload();
                });
            }

            // Button Disagree
            if (self.elements.btnDisagree !== undefined && self.elements.btnDisagree.length) {
                self.elements.btnDisagree.one('click.cookienotice.btnDisagree', function () {
                    self.disagree();
                    self.notice('hide');
                    self.reload();
                });
            }

            // Button Customize
            if (self.elements.btnCustomize !== undefined && self.elements.btnCustomize.length) {
                self.elements.btnCustomize.on('click.cookienotice.btnCustomize keyup.cookienotice.btnCustomize', function (event) {
                    self.modal(event, 'show');
                });
            }

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
         * Agree a service
         *
         * @param {string=undefined} service
         */
        agree: function (service) {
            service = service || 'all';

            return this.setState(service, true);
        },

        /**
         * Disagree a service
         *
         * @param {string=undefined} service
         */
        disagree: function (service) {
            service = service || 'all';

            return this.setState(service, false);
        },

        /**
         * Set the state of service
         *
         * @param {string} service
         * @param {boolean|string} state true/false or 'undefined'
         */
        setState: function (service, state) {
            let self = this;

            // Gloal variables
            if (service === 'all' && self.config.services !== undefined) {
                $.each(self.config.services, function (configService) {
                    if (configService !== 'all') {
                        $.CookieNotice.services[configService] = state;
                    }
                });
            } else {
                $.CookieNotice.services[service] = state;
            }

            if (state !== 'undefined') {
                // Service action (all)
                self.elements.serviceAllWrapper.each(function (index, serviceAll) {
                    let allItem = $(serviceAll).find('.' + self.settings.classes.prefix + '-service-action');

                    if (allItem.length) {
                        allItem.removeClass(self.settings.classes.serviceAgreed);
                        allItem.removeClass(self.settings.classes.serviceDisagreed);
                        allItem.find('input').prop('checked', false);
                        allItem.find('label').html(self.config.services.all.customize);
                    }
                });

                // Service action (modal)
                if (self.elements.serviceAction.length) {
                    self.elements.serviceAction.each(function (index, btn) {
                        btn = $(btn);
                        let btnServiceElement = btn.closest('.' + self.settings.classes.prefix + '-service');
                        let btnService = btnServiceElement.attr('data-service');

                        if (btnService === service || service === 'all') {
                            let btnInput = btn.find('input');
                            let btnLabel = btn.find('label');

                            // Btn state
                            btn[(state ? 'add' : 'remove') + 'Class'](self.settings.classes.serviceAgreed);
                            btn[(state ? 'remove' : 'add') + 'Class'](self.settings.classes.serviceDisagreed);
                            btnInput.prop('checked', state);
                            btnLabel.html(self.config.services.all[state ? 'agree' : 'disagree']);
                        }
                    });
                }

                // Service handler
                let targets = self.elements.body.find('[data-cookienotice]');
                if (targets.length) {
                    targets.each(function (index, target) {
                        target = $(target);
                        let targetService = target.attr('data-cookienotice-service');

                        if (targetService === service || service === 'all') {
                            let serviceHandler = target.find('.' + self.settings.classes.serviceHandler);

                            target.removeClass(state ? self.settings.classes.serviceDisagreed : self.settings.classes.serviceAgreed);
                            target.addClass(state ? self.settings.classes.serviceAgreed : self.settings.classes.serviceDisagreed);
                            serviceHandler.attr('aria-hidden', state);

                            if (!state && target.is('a')) {
                                target.on('click.cookienotice', function (event) {
                                    event.preventDefault();
                                });
                            }
                        }
                    });
                }

                // Cookie storage
                self.setCookie(self.cookieName, JSON.stringify($.CookieNotice.services), this.settings.cookieDuration);

                // User callback
                let userEvent = {
                    cookieNotice: self,
                    elements: self.elements,
                    services: $.CookieNotice.services,
                    service: service,
                    state: state
                };
                self.elements.container.trigger('changestate.cookienotice', [userEvent]);
                if (self.settings.onChangeState !== undefined) {
                    self.settings.onChangeState.call(userEvent);
                }
            }

            return self;
        },

        /**
         * Load services state from cookie storage
         *
         * @return {boolean|object}
         */
        loadStates: function () {
            let states = this.getCookie(this.cookieName);

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
         * Return the state of service. If there is no choice, the returned state is "undefined"
         *
         * @param {string} service
         * @return {boolean|string}
         */
        getState: function (service) {
            if ($.CookieNotice.services[service] !== undefined) {
                return $.CookieNotice.services[service];
            }

            return 'undefined';
        },

        /**
         * Return true if the service is allowed
         *
         * @param {string} service
         * @return {boolean}
         */
        isAllowed: function (service) {
            return this.getState(service) === true;
        },

        /**
         * Return true if there is a saved consent
         *
         * @return {boolean}
         */
        hasConsent: function () {
            return !!this.getCookie(this.cookieName);
        },

        /**
         * Reload current url
         */
        reload: function () {
            if (this.settings.reload) {
                window.location.reload();
            }
        },

        /**
         * Utils
         */
        getCookie: function (name) {
            let regex = new RegExp('(?:; )?' + name + '=([^;]*);?');

            return regex.test(document.cookie) ? decodeURIComponent(RegExp['$1']) : null;
        },
        setCookie: function (name, value, duration, path, secure) {
            let today = new Date();
            let expires = new Date();
            path = path || '/';
            secure = secure || true;

            expires.setTime(today.getTime() + (duration*24*60*60*1000));
            document.cookie = name + '=' + value + ';expires=' + expires.toGMTString() + ';path=' + path + ';' + (secure ? 'secure' : '');
        },
        removeCookie: function (name, path) {
            return this.setCookie(name, '', -1, path);
        },
        setLog: function (log, type) {
            type = type || 'log';

            console[type]('CookieNotice: ' + log);
        },
        formatDescription: function (description) {
            return description
                .replace('{agree}', this.config.notice.agree)
                .replace('{disagree}', this.config.notice.disagree)
                .replace('{customize}', this.config.notice.customize);
        },
        replacePrefixClass: function () {
            let self = this;

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