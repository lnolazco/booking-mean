'use strict';

angular.module('bookings').directive('dj3Graph', [
	function() {
		return {
			restrict: 'EA',
			replace: false,
			scope: {series: '='},
			link: function (scope, element, attrs) {


				scope.$watch("series", function (newValue) {
					if (newValue === undefined) return;

					$("svg").remove();

					var margin = {top: 20, right: 20, bottom: 30, left: 40},
						width = 250, //960 - margin.left - margin.right,
						height = 200; //500 - margin.top - margin.bottom;

					var x = d3.scale.ordinal()
						.rangeRoundBands([0, width], .1);

					var y = d3.scale.linear()
						.range([height, 0]);

					var xAxis = d3.svg.axis()
						.scale(x)
						.orient("bottom");

					var yAxis = d3.svg.axis()
						.scale(y)
						.orient("left")
						.ticks(10, "€");

					var svg = d3.select(element[0]).append("svg")
						.attr("width", width + margin.left + margin.right)
						.attr("height", height + margin.top + margin.bottom)
						.append("g")
						.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

					x.domain(scope.series.map(function(d) { return d.x; }));
					y.domain([0, d3.max(scope.series, function(d) { return d.y; })]);

					svg.append("g")
						.attr("class", "x axis")
						.attr("transform", "translate(0," + height + ")")
						.call(xAxis);

					svg.append("g")
						.attr("class", "y axis")
						.call(yAxis)
						.append("text")
						.attr("transform", "rotate(-90)")
						.attr("y", 6)
						.attr("dy", ".71em")
						.style("text-anchor", "end")
						.text("Number");

					svg.selectAll(".bar")
						.data(scope.series)
						.enter().append("rect")
						.attr("class", "bar")
						.attr("x", function(d) { return x(d.x); })
						.attr("width", x.rangeBand())
						.attr("y", function(d) { return y(d.y); })
						.attr("height", function(d) { return height - y(d.y); });


				}, true);
			}
		};
	}
]);
