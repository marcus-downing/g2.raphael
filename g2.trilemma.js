jQuery(document).on('g2_register', function () {
  jQuery.g2.register('trilemma', function (paper, data, attrs) {
    var width = attrs.width;
    var height = attrs.height;

    //  background
    paper.rect(0, 0, width, height + 20).attr({
      'fill': 'white',
      'stroke-width': 0,
      'stroke-opacity': 0
    });

    //  draw the icons
    // paper.image('/wp-content/themes/wec/images/wec-icons/energy-security-24.png', width / 2 - 12, 2, 24, 24);
    // paper.image('/wp-content/themes/wec/images/wec-icons/environmental-impact-24.png', 4, height - 24, 24, 24);
    // paper.image('/wp-content/themes/wec/images/wec-icons/social-equity-24.png', width-28, height-24, 24, 24);
    paper.image('/wp-content/themes/wec/images/wec-icons/energy-security-icon.svg', width / 2 - 18, 2, 36, 36);
    paper.image('/wp-content/themes/wec/images/wec-icons/environmental-impact-mitigation-icon.svg', 2, height - 36, 36, 36);
    paper.image('/wp-content/themes/wec/images/wec-icons/social-equity-icon.svg', width - 40, height - 36, 36, 36);

    //  geometry
    var px = 36;
    var py = 24;

    var l = px;
    var r = width-px;
    var w = width-(px*2);
    var t = 30;
    var b = height-py;
    var h = height-t-py;
    var cx = width/2;
    var cy = t+h*3/5;

    var il = l+w/4;
    var ir = r-w/4;
    var it = (t+cy)/2;
    var ib = (b+cy)/2;

    //  wires
    var wire_path = 
       'M'+l+','+b+'L'+cx+','+t+'L'+r+','+b+'L'+l+','+b
      +'M'+il+','+ib+'L'+cx+','+it+'L'+ir+','+ib+'L'+il+','+ib
      +'M'+l+','+b+'L'+cx+','+cy
      +'M'+cx+','+t+'L'+cx+','+cy
      +'M'+r+','+b+'L'+cx+','+cy

    //  trilemma data
    var es = data.energy_security / 10.0;
    var es_x = cx;
    var es_y = cy+(t-cy)*es;

    var se = data.social_equity / 10.0;
    var se_x = cx+(r-cx)*se;
    var se_y = cy+(b-cy)*se;

    var im = data.environmental_impact / 10.0;
    var im_x = cx+(l-cx)*im;
    var im_y = cy+(b-cy)*im;

    var trilemma_path = 
      'M'+es_x+','+es_y+
      'L'+se_x+','+se_y+
      'L'+im_x+','+im_y+
      'L'+es_x+','+es_y

    paper.path(trilemma_path).attr({
      'fill': '#ffddb3'
    });
    paper.path(wire_path).attr({
      'stroke-width': 2.0,
      'stroke': '#165788',
    });
    paper.path(trilemma_path).attr({
      'stroke-width': 5.5,
      'stroke': 'white'
    });
    paper.path(trilemma_path).attr({
      'stroke-width': 3.0,
      'stroke': '#f36b09',
      'fill': '#ffddb3',
      'fill-opacity': 0.4
    });
  });
});