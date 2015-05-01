'use strict';

// Dju module config
angular.module('dju').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('topbar', 'DJU', 'dju', 'dropdown');
        Menus.addSubMenuItem('topbar', 'dju', 'Calcul', 'dju');
        Menus.addSubMenuItem('topbar', 'dju', 'Import de données', 'dju-ref');
	}
]);
