/*
 * Usage: <a href="/" 
                data-ga 
                data-ga-type="event" 
                data-ga-category="category" 
                data-ga-action="action" 
                data-ga-label="label" 
                data-ga-value="value">Test</a>
 *
 *
 */

var window = window || {},
    document = document || {};

(function (window, document) {
    "use strict";
    
    var qsa = "querySelectorAll",
        supportedTypes = ["pageview", "event"],
        $ = document[qsa],
        gaHelper = {
            trackDOM: function ($el) {
                var self = this;
                
                switch (typeof $el) {
                    case "string":
                        $el = $($el);
                        break;

                    case "undefined":
                        $el = $("body")[0];
                        break;
                        
                    default:
                        break;
                }
                
                if ($el instanceof HTMLElement) {
                } else {
                    throw "Invalid selector or HTMLElement argument";
                }

                $el[qsa]("[data-ga]").forEach(function(el) {
                    var d = function(key) { return el.dataset[key]; },
                        type = d("gaType"),
                        args = [];
                    
                    if (!~supportedTypes.indexOf(type)) {
                        type = supportedTypes[0];
                    }
                    
                    switch(type) {
                        case "event":
                            args = [d("gaCategory"), d("gaAction"), d("gaLabel"), d("gaValue")];
                            break;
                            
                        case "pageview":
                        default:
                            args = [d("gaPage"), d("gaTitle"), d("gaLocation")];
                            break;
                    }

                    el.addEventListener("click", function() {
                        self[type].apply(self, args);
                    });
                });
            },
            pageview: function(page, title, location) {
                if (window.ga) {
                    ga("send", "pageview", {
                        "page": page,
                        "title": title,
                        "location": location
                    });
                }
            },
            event: function(category, action, label, value) {
                if (window.ga) {
                    ga("send", "event", category, action, label, value);
                }
            }
        };

    window.gaHelper = gaHelper;
})(window, document);