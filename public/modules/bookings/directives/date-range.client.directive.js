'use strict';

angular.module('bookings').directive('dateRange', [
	function() {
		return {
			restrict: 'EA',
			replace: true,
			scope:{
				depart:'=',
				return:'='
			},
			templateUrl: 'modules/bookings/directives/templates/date-range.html',
			link: function (scope, element, attrs) {
				$(element).attr('id', 'idDateRange');
				scope.depart = moment();
				scope.return = moment().add(6, 'days');

				var optionSet = {
					startDate: scope.depart,
					endDate: scope.return,
					minDate: moment(),
					showDropdowns: true,
					opens: 'right',
					buttonClasses: ['btn btn-default'],
					applyClass: 'btn-small btn-success',
					cancelClass: 'btn-small btn-warning',
					format: 'DD/MM/YYYY',
					separator: ' to ',
					locale: {
						applyLabel: 'Apply',
						cancelLabel: 'Clear',
						fromLabel: 'Depart',
						toLabel: 'Return',
						daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
						monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
						firstDay: 1
					}
				};

				element.daterangepicker(optionSet, function (start, end, label) {
					scope.$apply(function () {
						$('#' + $(element).attr('id') + ' span').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
						scope.depart = start;
						scope.return = end;
					});
				});
				$('#' + $(element).attr('id') + ' span').html(scope.depart.format('MMM D, YYYY') + ' - ' + scope.return.format('MMM D, YYYY'));

			}

		};
	}
]);
