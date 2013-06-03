(function () {
	'use strict';

	var select = document.querySelectorAll('.theSelect'),//set to your dropdown class
		data = 'data-content';

	function innerContent(el) {
		var indval;

		if (el && el.textContent) {

			indval = el.textContent;

		} else {

			indval = el.innerText;

		}

		return indval;

	}

	function setAttr(el) {

		var index = el.options.selectedIndex,
		indval = el.options[index];

		indval = innerContent(indval);

		el.parentNode.setAttribute(data, indval);

	}

	function eventChange(el) {

		if (el.addEventListener) {

			el.addEventListener('change', function () {

				setAttr(this);

			}, false);

		} else if (el.attachEvent) {

			el.attachEvent('onchange', function () {

				setAttr(el);

			}, false);

		}

	}

	if (select) {//check that selector exists

		for (var i = 0, l = select.length; i < l; i++) {

			var el = select[i];

			setAttr(el);

			eventChange(el);

		}

	}

})();
