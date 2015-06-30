'use strict';

module.exports = {
	app: {
		title: 'Boxever',
		description: 'Boxever JS Technical Evaluation - Flights',
		keywords: 'MongoDB, Express, AngularJs, Node.js, Boxever, booking, flights'
	},
	port: process.env.PORT || 3000,
	templateEngine: 'swig',
	sessionSecret: 'MEAN',
	sessionCollection: 'sessions',
	assets: {
		lib: {
			css: [
				'public/lib/bootstrap/dist/css/bootstrap.css',
				'public/lib/bootstrap/dist/css/bootstrap-theme.css',
				'public/lib/daterangepicker/daterangepicker-bs3.css',
				'public/lib/angular-autocomplete/angucomplete-alt.css'
			],
			js: [
				'public/lib/socket.io/socket.io-1.2.0.js',
				'public/lib/jqueryv1.11/jquery.min.js',
				'public/lib/daterangepicker/moment.min.js',
				'public/lib/angular/angular.js',
				'public/lib/angular-resource/angular-resource.js', 
				'public/lib/angular-cookies/angular-cookies.js', 
				'public/lib/angular-animate/angular-animate.js', 
				'public/lib/angular-touch/angular-touch.js', 
				'public/lib/angular-sanitize/angular-sanitize.js', 
				'public/lib/angular-ui-router/release/angular-ui-router.js',
				'public/lib/angular-ui-utils/ui-utils.js',
				'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
				'public/lib/daterangepicker/daterangepicker.js',
				'public/lib/angular-autocomplete/angucomplete-alt.js',
				'public/lib/d3.v3/d3.v3.min.js'
			]
		},
		css: [
			'public/modules/**/css/*.css'
		],
		js: [
			'public/config.js',
			'public/application.js',
			'public/modules/*/*.js',
			'public/modules/*/*[!tests]*/*.js'
		],
		tests: [
			'public/lib/angular-mocks/angular-mocks.js',
			'public/modules/*/tests/*.js'
		]
	}
};
