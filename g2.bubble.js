(function ($) {
  $(document).on('g2_register', function () {
    $.g2.register('bubble', function (paper, data, attrs) {
      for (keyword in data) {
        data[keyword].keyword = keyword;
      }
      var allBubbles = _(data).keys();
      data = _(data).sortBy(function (datum) { return -datum.time; });

      var impactValues = _.pluck(data, 'impact');
      var impactMax = _.max(impactValues);
      var impactMin = _.min(impactValues);
      var impactScale = impactMax - impactMin;

      var uncertaintyValues = _.pluck(data, 'uncertainty');
      var uncertaintyMax = _.max(uncertaintyValues);
      var uncertaintyMin = _.min(uncertaintyValues);
      var uncertaintyScale = uncertaintyMax - uncertaintyMin;

      var timeValues = _.pluck(data, 'time');
      var timeMax = _.max(timeValues);
      var timeMin = _.min(timeValues);
      var timeScale = timeMax - timeMin;

      //  init early so closures can find it
      var selectedKeywords = [];

      function toggleSelect(keyword) {
        var ix = selectedKeywords.indexOf(keyword);
        if (typeof ix !== 'undefined' && ix >= 0)
          selectedKeywords = _(selectedKeywords).without(keyword);
        else
          selectedKeywords.push(keyword);
      }
      function toggleSelectAll(keywords) {
        var unselected = _(keywords).difference(selectedKeywords);
        if (_(unselected).isEmpty())
          selectedKeywords = _(selectedKeywords).difference(keywords);
        else
          selectedKeywords = _(selectedKeywords).union(unselected);
      }
      function isSelected(keyword) {
        var ix = selectedKeywords.indexOf(keyword);
        return typeof ix !== 'undefined' && ix >= 0;
      }
      function isOpaque(keyword) {
        return _(selectedKeywords).isEmpty() || isSelected(keyword);
      }

      //  scale the data against the box
      var minrad = 10;
      var maxrad = 40;
      var medrad = (minrad+maxrad)/2;
      var radScale = maxrad - minrad;
      var pad = 20 + maxrad;
      var width = attrs.width - (pad*2);
      var height = attrs.height - (pad*2);

      //  background
      paper.rect(0, 0, attrs.width, attrs.height + 20).attr({
        'fill': '45-#f7f7f7-#d1d1d1',
        'stroke-width': 0,
        'stroke-opacity': 0
      });

      //  draw the graph axes
      var axispad = 40;
      var ax_width = attrs.width - (axispad*2)
      var ax_height = attrs.height - (axispad*2);

      var ax_left = axispad;
      var ax_right = axispad+ax_width;
      var ax_top = axispad;
      var ax_bottom = axispad+ax_height;
      var axisLineStyle = {
        'stroke-width': 2.0,
        'stroke-opacity': 1.0,
        'stroke': '#555',
        'arrow-end': 'classic-wide-long',
      };
      paper.path('M'+ax_left+','+ax_bottom+'V'+ax_top).attr(axisLineStyle);
      paper.path('M'+ax_left+','+ax_bottom+'H'+ax_right).attr(axisLineStyle);
      var ax_mid = parseInt((ax_top+ax_bottom)/2);
      paper.path('M'+ax_left+','+ax_mid+'H'+ax_right).attr({
        'stroke-width': 1.0,
        'stroke-opacity': 1.0,
        'stroke': '#555',
        'stroke-dasharray': '-'
      });
      var axisStyle = {
        'font': "16px Cabin Condensed",
        'fill': '#555'
      };
      paper.text((ax_left+ax_right)/2-10, ax_bottom+18, 'IMPACT OF ISSUE').attr(axisStyle);
      paper.text(ax_left-18, (ax_top+ax_bottom)/2, 'UNCERTAINTY').attr(axisStyle).rotate(-90);

      paper.text(ax_left-2, ax_bottom+18, 'LOW').attr(axisStyle);
      paper.text(ax_left-2, ax_top-18, 'HIGH').attr(axisStyle);
      paper.text(ax_right-2, ax_bottom+18, 'HIGH').attr(axisStyle); 

      paper.text(ax_right-60, ax_top+30, 'CRITICAL\nUNCERTAINTIES').attr(axisStyle);
      paper.text(ax_right-60, (ax_top+ax_bottom)/2+40, 'NEED FOR\nACTION').attr(axisStyle);
      paper.text(ax_left+80, ax_bottom-40, 'WEAK SIGNALS').attr(axisStyle);

      // draw the actual bubbles
      for (i in data) {
        var d = data[i];
        var impact = (d.impact - impactMin) / impactScale;
        var uncertainty = (d.uncertainty - uncertaintyMin) / uncertaintyScale;
        var time = (d.time - timeMin) / timeScale;

        // bubble
        var x = pad + impact * width;
        var y = pad + (1 - uncertainty) * height;
        var rad = minrad + time * radScale;

        var bubble = paper.circle(x, y, rad);
        data[i].bubble = bubble;
        var colour = d['colour'];
        var stroke = lighten(d['colour'], 100);
        bubble.attr({
          'fill': colour,
          'opacity': 0.9,
          'stroke-width': 3.0,
          'stroke-opacity': 1.0,
          'stroke': stroke,
          'cursor': 'pointer',
        }).data('item', d.keyword);

        // label
        var textLabel = paper.text(x, y, data[i].name).attr({
          'font': "16px Cabin Condensed",
          'fill': 'white',
          'text-anchor': 'middle',
        });
        var bbox = textLabel.getBBox();
        var textBox = paper.rect(bbox.x - 4, bbox.y - 1, bbox.width + 8, bbox.height + 2, 3).attr({
          'fill': colour,
          'fill-opacity': 0.9,
          'stroke-width': 0,
          'stroke-opacity': 0.0,
        });
        textLabel.toFront();
        var labelSet = paper.set();
        labelSet.push(textBox, textLabel);
        labelSet.attr({ 
          'opacity': 0.0,
          'cursor': 'pointer', 
        }).data('item', d.keyword);
        data[i].label = labelSet;

        var hoverIn = function (e) {
          if (!isSelected(this.keyword))
            this.label.toFront().animate({ 'opacity': 0.6 }, 50);
        };
        var hoverOut = function (e) {
          if (!isSelected(this.keyword))
            this.label.animate({ 'opacity': 0.0 }, 50);
        };
        var hoverContext = { 'label': labelSet, 'keyword': d.keyword };

        bubble.hover(hoverIn, hoverOut, hoverContext);
        labelSet.hover(hoverIn, hoverOut, hoverContext);
      }

      //  interactive behaviour
      function updateBubbles() {
        // first bubbles
        for (i in data) {
          var keyword = data[i].keyword;
          if (isOpaque(keyword))
            data[i].bubble.toFront().animate({ 'opacity': 0.9 }, 150);
          else
            data[i].bubble.animate({ 'opacity': 0.2 }, 150);

          if (isSelected(keyword))
            $('#issue-list-selectors li[data-item='+keyword+']').addClass('selected');
          else
            $('#issue-list-selectors li[data-item='+keyword+']').removeClass('selected');
        }
        // then labels, doneafterwards so they're always on top
        for (i in data) {
          var keyword = data[i].keyword;
          if (isSelected(keyword))
            data[i].label.toFront().animate({ 'opacity': 0.9 }, 150);
          else
            data[i].label.animate({ 'opacity': 0.0 }, 150);
        }
      }

      $(".issue-list li").click(function () {
        var keyword = $(this).data('item');
        if (keyword == 'all') {
          var lis = $(this).closest('ul').find('li').not('[data-item=all]').get();
          var keywords = _(lis).map(function (li) { return $(li).data('item'); });
          toggleSelectAll(keywords);
          updateBubbles();
        } else {
          toggleSelect(keyword);
          updateBubbles();
        }
      });
      for (i in data) {
        data[i].bubble.click(function (e) {
          var keyword = this.data('item');
          toggleSelect(keyword);
          updateBubbles();
        });
        data[i].label.click(function (e) {
          var keyword = this.data('item');
          toggleSelect(keyword);
          updateBubbles();
        });
      }
    });
  });
})(jQuery);