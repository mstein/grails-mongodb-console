/*
 * Copyright Doc4web Consulting (c) 2013.
 */
MongoDBConsoleModule.directive('cbxShiftSelectable', function($timeout, $rootScope) {
    var lastChecked;
    var defaultClassName = "shift-selectable";
    var state = {active:true};
    // Attach the event for the shift-click
    $('body').on('click', '.'+defaultClassName, function(event){
        // to prevent recursive execution of this event
        if(!state.active) return;
        state.active = false;
        if(!lastChecked) {
            lastChecked = this;
            state.active = true;
            return;
        }

        var checkboxes = $('.'+defaultClassName);
        if(event.shiftKey) {
            var start = checkboxes.index(this),
                end = checkboxes.index(lastChecked);
            checkboxes.slice(Math.min(start, end), Math.max(start, end) + 1)
                .filter(':enabled') // We don't want to affect the disabled checkboxes
                .prop('checked', lastChecked.checked)
                .trigger('change');
                // Angular ngModel listen on 'click' for checkboxes,
                // but we can't just trigger the "click" since this very listener is already listening to the "click"
                // event and would trigger again.
        }

        lastChecked = this;
        state.active = true;
    });
    return {
        restrict: 'A',
        require:'ngModel',
        link: function(scope, element, attrs, ctrl) {
            if(element[0].tagName == "INPUT" && attrs['type'].toLowerCase() == "checkbox") {
                element.addClass(defaultClassName);
                if(angular.isDefined(attrs["checkboxShiftSelectable"]) && attrs["checkboxShiftSelectable"] != "") {
                    element.data("group", attrs["checkboxShiftSelectable"]);
                }
                element.on('change', function(){
                    scope.$apply(function() {
                        ctrl.$setViewValue(element[0].checked);
                    });
                });
            }
        }
    };
}).directive('cbxSelected', function(){
        var shared = {
            isSelected:false,
            selected:[]
        };
        var defaultClassName = "shift-selectable";
        return {
            restrict:'A',
            controller:function($scope) {
                $scope.$selected = function(){
                    return shared.selected;
                };
            },
            link:function(scope, element, attrs) {
                var selector = attrs['cbxSelected'];
                if(!angular.isDefined(selector) || selector == null || selector.trim() == "") {
                    selector = '.'+defaultClassName;
                }
                var initialEmpty = $(selector).filter(":checked").size() == 0;
                $('body').off('.cbxSelected').on('change.cbxSelected', selector, function(){
                    shared.isSelected = $(selector).filter(":checked").size() > 0;
                    shared.selected = [];
                    $(selector).filter(':checked').each(function(){
                        shared.selected.push($(this).val());
                    });

                    scope.$apply();
                });

                // Show if there is at least 1 checkbox selected
                if(angular.isDefined(attrs['cbxShow'])) {
                    if(initialEmpty) {
                        element.hide();
                    }
                    scope.$watch(function(){return shared.isSelected;}, function(value){
                        if(value) element.show();
                        else element.hide();
                    });
                }

                // Disable if no checkbox selected
                if(angular.isDefined(attrs['cbxDisabled'])) {
                    if(initialEmpty) {
                        element.attr('disabled', true);
                    }
                    scope.$watch(function(){return shared.isSelected;}, function(value){
                        if(value) element.attr('disabled', false);
                        else element.attr('disabled', true);
                    });
                }

                // Add class if checkbox selected
                if(angular.isDefined(attrs['cbxClass'])) {
                    if(initialEmpty) {
                        element.removeClass(attrs['cbxClass']);
                    }

                    scope.$watch(function(){return shared.isSelected;}, function(value){
                        if(value) element.addClass(attrs['cbxClass']);
                        else element.removeClass(attrs['cbxClass']);
                    });
                }
            }
        }
    }).directive('cbxSelectAll', function(){
        var defaultClassName = "shift-selectable";
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var selector = '.'+defaultClassName;
                if(angular.isDefined(attrs['checkboxSelectAll']) && attrs['checkboxSelectAll'] != null && attrs['checkboxSelectAll'].trim() != "") {
                    selector = attrs['checkboxSelectAll'];
                }
                if(element[0].tagName == "INPUT" && attrs['type'].toLowerCase() == "checkbox") {
                    if(selector) {
                        element.click(function() {
                            $(selector+':enabled').prop("checked", element.is(':checked')).trigger('change');
                        });
                    } else {
                        element.click(function() {
                            $('input[type=checkbox]:enabled').prop("checked", element.is(':checked')).trigger('change');
                        });
                    }
                }
            }
        }
    });
