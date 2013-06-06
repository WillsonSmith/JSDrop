(function () {
	'use strict';

	var select = document.querySelectorAll('.theSelect'),//set to your dropdown class
		data = 'data-content';

	function innerContent(el) {//gets content of option selected
		var indval;

		if (el){//if element exists
			if (el.textContent) {//if .textContent is supported

				indval = el.textContent;

			} else {//else not supported, use innerText

				indval = el.innerText;

			}
		}

		return indval;

	}

	function setAttr(el) {

		var index = el.options.selectedIndex,//get the selected index of the option array
		indval = el.options[index];//get the specific option

		indval = innerContent(indval);

		el.parentNode.setAttribute(data, indval);//set wrapper attribute

	}

	function eventChange(el) {

		if (el.addEventListener) {//check that event listener works

			el.addEventListener('change', function () {

				setAttr(this);

			}, false);

		} else if (el.attachEvent) {//else is probabl ie8, use attachEvent

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
