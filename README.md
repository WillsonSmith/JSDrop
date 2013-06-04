JSDrop
======

Using some javascript and CSS to make custom drop down arrows for select boxes for all browsers including IE8+

Preview/Demo: [http://codepen.io/WillsonSmith/full/DobEJ](http://codepen.io/WillsonSmith/full/DobEJ)

	Licensed under the CSS-Tricks license http://css-tricks.com/license/ (see bottom of readme)

File Size:

* uncompressed: 994 bytes
* minified: 470 bytes
* gzipped & minified: 297 bytes

What it does
======
JSDrop is a small bit of javascript, as well as some css tricks in order to have custom drop down arrows cross-browser using css "content:" and data-* attributes.


How it works
======

You have a form containing the select box you wish to have your custom styles on. 

In this form, your select box is assigned a class, which will be selected in the JavaScript with `document.querySelectorAll()`.

The select box has a wrapper, which does not require any specific class, but requires a `data-content` attribute. The class is recommended for styling purposes, but you could theoretically select it with `.selectWrap[data-content]`.
	
(Note: this is automatically set to the first/default item in your drop down, however IE8 may not play nice without it being set.)

##The Markup

Your form will look something like below:

	<form>

		<div class='selectWrap' data-content="">
			<select class='theSelect'>
				<option>Select an Option</option>
				<option>One</option>
				<option>Two</option>
				<option>Three</option>
			</select>
		</div>

	</form>
	
##The CSS	
	
The CSS of the wrapper is then styled to how you want your select box to look, this is because we will be hiding our select box.

This is how I have my wrapper styled:

	.selectWrap{

	border-radius: 5px;
	overflow: hidden;
	box-shadow: inset 0px 0px 4px #3f3f3f;
	width: 500px;

	position: relative;
	z-index: 1;

	}

For the most part the styles can be set how you want, but note the `z-index: 1;` and `position: relative;`, these are an important step, as they will allow for us to click the dropdown arrow once we set our arrow styling on our `:after` styling for the wrapper as seen next.

For my styles of the arrow, I have set the following:

	 .selectWrap:after{

	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;

	border-radius: 0 5px 5px 0;

	background: #27ae60;
	content: "\25BC";

	padding: 6px 6px;

	height: 100%;
	width: 30px;

	position: absolute;
	right: 0;
	top: 0;
	z-index: -1;

	}
	
`box-sizing: border-box` should be familiar, it just makes all padding contained within the box, as to not make your element larger. 

The border-radius is just some rounding on the corners to make sure it is contained in my wraper.

background is the colour I want my arrow's box, and the content is a unicode caret. 

Again we see a position set, this time it is set to `position: absolute;` and has set `top: 0;` and `right: 0;` this positions the arrow at the right most of the wrapper. Since our wrapper is set to `position: relative;`, the absolutely positioned :after element is positioned in relation to the wrapper.

>Since our wrapper is set to `position: relative;`, the absolutely positioned :after element is positioned in relation to the wrapper.

This is why the positioning is important.

Also, note again the `z-index` is set to -1, this is again important in allowing your arrow to be clickable. If this is not set to -1, and your wrapper set to a higher point, you will not be able to click the arrow in order to open the dropdown.


We will come back to `.selectWrap:before` when we get to the javascript.

We will now address the actual select drop down styling.

	.theSelect{
	
	-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
	opacity: 0;
	
	height: 30px;
	width: 100%;

	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;

	}

The important bit here is setting the opacity. In Webkit, setting `-webkit-appearance: none;"` or `appearance: none;` will hide the default look of a dropdown, in webkit if you do not set this, your styles will not be applied. However, this only hides the arrows in webkit, and will not do so in Firefox, or Internet Explorer, which is where `opacity: 0;` comes in.

`-ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";` is the microsoft filter for setting opacity on IE8, `opacity: 0;` should cover most other browsers ( See [CSS-Tricks on cross-browsers Opacity](http://css-tricks.com/snippets/css/cross-browser-opacity/) )

This will hide the select box, thus leaving your wrapper to act as the select box in its place. The drop down is still clickable, and the options of the dropdown will still appear as normal, and thus make this trick work. Note that if you were to set `visibility: hidden;` or `display: none;` this would NOT work because the select box would no longer be "there". This works by still having the select box "there", but be invisible. 

##The JavaScript

Now, you may be wondering "Won't setting `opacity: 0;` hide the option selected as well?". You would be correct, which is why we included a `data-content=""` attribute on the wrapper element.

First, let us look at the select wrapper's `:before` styles:

	.selectWrap:before{

	content: attr(data-content);
	position: absolute;
	top:5px;
	left:5px;

	}
	
Again, we have a `position: absolute;` and its position of top and left so it acts in the same manner the `:after` style does. Note: `top: x;` is used to vertically position the element, this is not necessary if you use a `line-height:` with the height of the wrapper as its value.

The interesting part here is the `content: attr(data-content)`. This feature allows you to set `content: attr(*)` where * is any attribute on the element in question. For example, you could also use `attr(href)`.

Here is where the JavaScript comes in, as we change the select box, we want to populat `data-content="*"` where * is equal to the selected option value. 

In the JavaScript, you must set the variable `select` as seen on line 4: `select = document.querySelectorAll('.theSelect')`. This must be set to the selector for your SELECT form element, NOT the wrapper. By default this is set to `.theSelect`, so if you wish you may set your markup as I did, and use that, however I recommend using something more suiting to your project. Also note that the variable `data` is set ti `'data-content';` you can change this if you really want, but I would recommend keeping this the same for semantic purposes. 

The first thing in the JavaScript you will see is:

	function innerContent(el) {
		var indval;

		if (el && el.textContent) {

			indval = el.textContent;

		} else {

			indval = el.innerText;

		}

		return indval;

	}

This function will take the element 'el', and either set the variable `indval`(index value) to `textContent`, or `innerText` based on what is available. Firefox does not support `innerText` (at least not in this case), and IE8 does not support `textContent`. Note we are not using `.innerHTML` because all encoded characters would show up decoded, for example `&`, would show up as `&amp;`

The next function defined is `setAttr(el);`

	function setAttr(el) {

		var index = el.options.selectedIndex,
		indval = el.options[index];

		indval = innerContent(indval);

		el.parentNode.setAttribute(data, indval);

	}

Here we take in an element, the select box as will bee seen in the next function, and check for the selected index (`index`), and then set `indval`(index value - the value of the selected item) to the option of that index. From there we run our function `innerContent(el)` on indval, and spit out the actual value.

`el.parentNode.setAttribute(data, indval);` then sets th `data-content`(data, as defined earlier) attribute of the element's parent, the wrapper to `indval` which is whatever option you selected.

Next we define `eventChange(el);` which will be run in a loop as defined next.
	
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

Essentially all we do here is check if `addEventListener` is valid and either uses that, or `attachEvent` for IE8. In these it runs SetAttr to assign the proper `data-content` attribute.

Finally we have our main event loop that adds the event listeners to all of our select boxes with our designated `select` class. 

	if (select) {//check that selector exists

		for (var i = 0, l = select.length; i < l; i++) {

			var el = select[i];

			setAttr(el);

			eventChange(el);

		}

	}
We set `el` to the select box we are on.

We then run `setAttr(el);` to set the default value on all of the select boxes.

Finally we attach the event of `change` to each select box as defined in `eventChange(el)`.

The whole thing is wrapped in `(function(){})();` in order to preserve namespacing, and have the JavaScript auto-fire. This script should be included inside, at the bottom of your body tag.

A more basic how-to will be coming soon.

>LICENSE

>SUPER IMPORTANT LEGAL DOCUMENT
------------------------------
>I don't give two hoots what you do with any of the design or code you find here.

>Actually, I do. I hope you take it and use it, uncredited, on a super commercial website and get wicked rich off it. I hope you use it at work and your boss is impressed and you get a big promotion. I hope it helps you design a website and that website impresses somebody you think is super hot and you get married and have smart, chill babies. I hope you use the code in a blog post you write elsewhere and that website gets way more popular and awesome than this one.

>If you feel like telling me about it, cool. If not, no big deal. If you feel better crediting it, that's cool. If not, don't sweat it.

>If you copy an entire article from this site and republish it on your own site like you wrote it, that's a little uncool. I won't be mad at you for stealing, I just think you're better than that and want to see you do better. I'm not going to come after you though. I'd rather play ball with my dog. The only time I'll be mad at you is if you go out of your way to try and hurt me somehow. And again I probably won't even be mad, just sad. Unless I'm having a bad day too, in which case I apologize in advance for my snarky replies.


>I want the web to get better and being all Johnny Protective over everything doesn't get us there. I understand other people feel differently about this and might have semi-legit reasons for protecting certain code, design, writing, or whatever. I work on some closed-source projects myself. CSS-Tricks isn't one of them. Go nuts.

[CSS-Tricks License Link](http://css-tricks.com/license/)


	License is under this or wtfpl, this has been chosen for its lack of cursing.

