# Documentation CookieNotice

* Dependency: jQuery, PHP (to generate json config, but you can use other way to build json configuration data)


## Featuring

**First step:** a notice is displayed to inform the user of cookies for a listing of services. The choice is mandatory to continue the navigation.

**Second step:** a choice is made if the user:
* clicks on the notice button "I accept", which will accept all cookies
* clicks on the notice button "I deny", which will deny all cookies
* clicks on the notice button "I customize", to customize the services one by one
* clicks on the service button "Allow" after deny all services, which will accept only the wanted service

**Third step:** the deposit of one cookie to save user consent:
* for a maximum duration of 13 months
* there is a possibility of changing to return to customized services


## Initialisation

    <?php require_once '../src/CookieNotice/Config.php'; // To configure ?>
    <?php require_once '../src/CookieNotice/Service.php'; // Optional ?>
    
    <div id="notice-cookie" data-config="<?php echo htmlspecialchars(\CookieNotice\Config::get()); ?>"></div>
    
    $('#notice-cookie').cookieNotice([options]);
    
    <a href="#" class="cookienotice-customize">Customize the cookies</a>


## PHP side

### Configuration (mandatory)

The configuration of **CookieNotice** is in this file _CookieNotice/Config.php_ in method _Config::set()_.
You can translate texts in this file.

___notice___: Notice configuration
* _description_: Notice contents
* _summary_: Summary of notice contents showed in mobile
* _agree_: Button label to customize services
* _disagree_: Button label to accept all services
* _customize_: Button label to deny all services
   
(optional) ___modal___: Modal configuration to customize services
* _label_: Modal title
* _labelTag_: (optional) Tag used for modal title. If hN, the subtitles will be increase automatically
* _description_: (optional) Modal description
* _close_: Button label to close modal
    
___groups___: Groups list of services
* ___group_id___: Default: none. For example: video 
    * _label_: Group title
    * _description_: (optional) Group description
        
___services___: Services list associated to groups
* __all__: for all services
  * _label_: Service title
  * _customize_: Button label to customize service
  * _agree_: Button label to accept service
  * _disagree_: Button label to deny service
  * _disabled_: Text displayed if the service is disabled
  * _allow_: Button label to allow service under disabled text
  * _position_: Position of the line "all services": before, after or both

* ___service_id___: for example: youtube or video
  * _label_: Service title
  * _description_: (optional) Service description
  * _url_: (optional) External Url to cookies privacy-policy
  * _group_: Associated group id
      
      
### Methods

* namespace : **CookieNotice**
* classe    : **Service**
        
| Method             | Arguments                                                        | Description                                                                           |
|--------------------|------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| getState           | **service** *string* Service identifier, for example: "youtube"  | Return true if the service is allowed                                                 |                 
| isAllowed          | **service** *string* Service identifier, for example: "youtube"  | Return the state of service. If there is no choice, the returned state is "undefined" |                 
| hasConsent         | -                                                                | Return true if there is a saved consent                                               |


### Test allowed services

I recommend to test in JS side to exempt cache issues

    if (\CookieNotice\Service::isAllowed('facebook'))) {
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


## JS side

### Options

| Option                                   | Type     | Default value              | Description                                                        |
|------------------------------------------|----------|----------------------------|--------------------------------------------------------------------|
| classes                                  | object   | See below                  | Object for below options                                           |
| &nbsp;&nbsp;&nbsp;&nbsp;prefix           | string   | 'cookienotice'             | Prefix class name                                                  |
| &nbsp;&nbsp;&nbsp;&nbsp;notice           | string   | 'notice notice--cookie'    | Class for notice                                                   |
| &nbsp;&nbsp;&nbsp;&nbsp;noticeOpen       | string   | 'is-{prefix}-notice-open'  | Class for notice when is opened                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;modal            | string   | 'modal modal--cookie'      | Class for modal                                                    |
| &nbsp;&nbsp;&nbsp;&nbsp;modalOpen        | string   | 'is-{prefix}-modal-open'   | Class for modal when is opened                                     |
| &nbsp;&nbsp;&nbsp;&nbsp;serviceHandler   | string   | '{prefix}-service-handler' | Class for service handler wrapper                                  |
| &nbsp;&nbsp;&nbsp;&nbsp;serviceAgreed    | string   | 'is-agreed'                | Class for the service which is agreed                              |
| &nbsp;&nbsp;&nbsp;&nbsp;serviceDisagreed | string   | 'is-disagreed'             | Class for the service which is disagreed                           |
| &nbsp;&nbsp;&nbsp;&nbsp;btnAgree         | string   | '{prefix}-agree'           | Class for agree button                                             |
| &nbsp;&nbsp;&nbsp;&nbsp;btnDisagree      | string   | '{prefix}-disagree'        | Class for disagree button                                          |
| &nbsp;&nbsp;&nbsp;&nbsp;btnCustomize     | string   | '{prefix}-customize'       | Class for customize button                                         |
| &nbsp;&nbsp;&nbsp;&nbsp;active           | string   | 'is-active'                | Class pour l'état actif d'un service                               |
| &nbsp;&nbsp;&nbsp;&nbsp;inactive         | string   | 'is-inactive'              | Class pour l'état inactif d'un service                             |
| reload                                   | boolean  | false                      | Enable reloading current url after a change of service state       |
| summary                                  | int/bool | 767                        | Max witdh in pixel to show the summary of notice. False to disable |
| cookieDuration                           | integer  | 13*30                      | Consent storage duration                                           |
| tabindexStart                            | integer  | 0                          | Value of tabindex attribute at CookieNotice initialisation         |
| afterWrapNotice                          | function | undefined                  | Callback after the notice added to DOM                             |
| afterWrapModal                           | function | undefined                  | Callback after the modal added to DOM                              |
| afterWrapServiceHandler                  | function | undefined                  | Callback after the service handler added to DOM                    |
| afterEventsHandler                       | function | undefined                  | Callback after register events                                     |
| onChangeState                            | function | undefined                  | Callback on change service state (all or service)                  |


### Methods

| Method             | Arguments                                                                                                                                                                  | Description                                                                           |
|--------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| notice             | **action** *string* Action "show" or "hide"                                                                                                                                | Show/hide notice                                                                      |
| modal              | **action** *string* Action "show" or "hide"                                                                                                                                | Show/hide modal                                                                       |
| agree              | **service** *string* Service identifier                                                                                                                                    | Agree a service                                                                       |
| disagree           | **service** *string* Service identifier                                                                                                                                    | Disagree a service                                                                    |
| setState           | **service** *string* Service identifier, **state** *mixed* true, false or "undefined" to define the service state                                                          | Set the state of service                                                              |
| loadStates         | -                                                                                                                                                                          | Load services state from cookie storage                                               |
| getState           | **service** *string* Service identifier                                                                                                                                    | Return the state of service. If there is no choice, the returned state is "undefined" |                 
| isAllowed          | **service** *string* Service identifier                                                                                                                                    | Return true if the service is allowed                                                 |                 
| hasConsent         | -                                                                                                                                                                          | Return true if there is a saved consent                                               |
| reload             | -                                                                                                                                                                          | Reload current url                                                                    |
| getCookie          | **name** *string* Cookie name                                                                                                                                              | Get cookie value                                                                      |
| setCookie          | **name** *string* Cookie name, **value** *string* Cookie value, **duration** *int* Duration in day, **path** *string="/"* Storage path, **secure** *bool=true* Secure mode | Set cookie value                                                                      |
| removeCookie       | **name** *string* Cookie name, **path** *string* Storage path                                                                                                              | Remove a cookie                                                                       |
| destroy            | -                                                                                                                                                                          | Remove CookieNotice from DOM                                                          |


### Test allowed services

    let cookieNotice = $('#notice-cookie').cookieNotice();
    
    if (cookieNotice.isAllowed('facebook')) {
        // OK
    }
    
    // or

    var state = cookieNotice.getState('facebook');
    if (state === true) {
        // OK
    }
    
    // Savec consent?
    if (cookieNotice.hasConsent()) {
        // OK
    }