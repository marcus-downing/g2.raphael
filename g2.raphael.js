/*
 * g2.Raphael
 * A replacement graphing system using Raphael.js
 * 
 * Uses data attributes to convey both the graph data and other parameters needed
 * to render it correctly.
 */

(function ($) {
  // $('selector').g2();
  $.fn.g2 = function (customArgs) {
    var self = this;

    // initialise the graph modules on demand
    if (!$.g2.initialised) {
      $(document).trigger('g2_register');
      $.g2.initialised = true;
    }

    // if applied to lots of elements, run on each one separately
    if (self.length > 1) {
      return self.each(function () {
        return $(this).g2(customArgs);
      });
    }

    // don't initialise the same graph twice
    if (self.data('graph-init'))
      return this;

    // get the data
    var type = self.data('graph-type');

    // use a module to render the graph
    if ($.g2.modules[type]) {
      var module = $.g2.modules[type];

      // combine the different args
      var defaultArgs = $.g2.defaultArgs[type];
      var domArgs = self.data('graph-args');
      var args = $.extend({}, defaultArgs, $.g2.globalArgs, domArgs, customArgs);
      if (args['args_callback']) {
        args = args['args_callback'](args);
        delete args['args_callback'];
      }

      // load the data
      var data = self.data('graph-data');
      if (!data && args[data]) {
        data = args[data];
      }
      if (!data && args[source]) {
        var source = args[source];

        // get data from a function
        if ($.isFunction(source))
          data = source(args);

        else if ($.isString(source)) {
          var urlPattern = new RegExp('^(https?:\/\/)?'+ // protocol
            '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
            '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
            '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
            '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
            '(\#[-a-z\d_]*)?$','i'); // fragment locater

          //  load data from a url
          if (urlPattern.test(source))
            data = $.getJSON(source);

          //  get data from an element's attribute
          else {
            var sourceElement = $(source);
            // ...todo: split the source into a jQuery selector and an attribute name...
          }
        }
      }
      if (args['data_callback']) {
        data = args['data_callback'](data);
        delete args['data_callback'];
      }
      if (!data)
        return this;

      //  init Raphael
      self.data('graph-init', true);
      var width = this.width();
      var height = this.height();
      this.empty();
      this.css({'height': height});
      var element = this.get(0);
      var paper = Raphael(element, width, height);

      //  execute the module
      $.extend(args, {
        'width': width,
        'height': height,
        'element': element
      });
      module(paper, data, args);
    }

    return this;
  };

  $.g2 = function (selector, customArgs) {
    return $(selector).g2(customArgs);
  };

  $.extend($.g2, {
    modules: {},
    defaultArgs: {},
    globalArgs: {},

    register: function (type, callback, defaultArgs) {
      $.g2.modules[type] = callback;
      if (defaultArgs)
        $.g2.defaultArgs[type] = defaultArgs;
    }
  });

  // simple proof of concept module
  $.g2.register('example', function (paper, data, args) {
    paper.rect(0, 0, args.width, args.height).attr({
      'fill': '#f8f8f8',
      'stroke-width': 0,
      'stroke-opacity': 0
    });
    paper.text(10,20,"Hello, world.").attr({
      'fill': 'black',
      'font': '20px Arial',
      'text-anchor': 'start'
    });
  });

})(jQuery);