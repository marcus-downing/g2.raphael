g2.raphael
==========

Alternative graphing module for Raphael.js

== Work in progress ==

This is a work in progress. Come back later to find it more complete.

== Introduction ==

Raphael.js is an impressive library, but the official graphing module for it isn't nearly as complete.
This is an alternative graphing library, providing the same graph types as well as a number of others.

It uses data attributes to convey both the data and the extra parameters needed to render a graph.

== How to use ==

You will need:

* [jQuery](http://jquery.com/)
* [Underscore.js](http://underscorejs.org/)
* [Raphael.js](http://raphaeljs.com/)

=== HTML ===

Create an HTML element with data attributes:

```html
<div id='my-graph'
     data-graph-type='bar'
     data-graph-data='{"foo": 12, "bar": 19, "qux": 27}'
     data-graph-args='{"orientation": "h", "x-axis": "Horizontal axis", "y-axis": "Vertical axis"}'
     >Loading graph...</div>
```

The contents of the element will be displayed until the graph is loaded, so that's a good place to put a loading indicator.

=== Javascript ===

When you're ready (I suggest using `$(document).ready`), call `g2` on a jQuery selection.

```javascript
$(document).ready(function () {
    $('#my-graph').g2();
});
```

This will pick up the parameters on the `#my-graph` element and render the graph.
Any arguments you pass into g2 will override the parameters in the HTML.

```javascript
$('#my-graph').g2({ 'width': 500, 'height': 200 });
```
