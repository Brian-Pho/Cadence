// Source code licensed under Apache License 2.0. 
// Copyright © 2017 William Ngan. (https://github.com/williamngan/pts)
// Code from: https://ptsjs.org/demo/edit/?name=geom.perpendicular

// Create the CanvasSpace and CanvasForm
let homepage_animation_id = "homepage-animation";
let homepage_animation_bg_color = "#F5F8FA";
Pts.quickStart(document.getElementById(homepage_animation_id), homepage_animation_bg_color);

// Let the CanvasSpace resize
space.autoResize = true;
// The number of points to create
let num_points = 250;
// The color of the first wave
let wave_color_first = "#34495E";
// The color of the second wave
let wave_color_second = "#AAB7B8";
// The height of both waves
let wave_amplitude = 1.5;
// The line thickness of both waves
let line_thickness = 2;
// Angle of the wave tilt
let wave_tilt_angle = 0.2;
// Repeat or boundback rate
let repeat_rate = 10000;
// Wave speed or repeat speed
let repeat_speed = 10000;
// Phase shift or wave horizontal offset
let wave_phase = 0;
// The amount of padding the navbar takes
let navbar_padding = 105;
// The amount of padding the scrollbar takes
let scrollbar_padding = 17;
// The amount of left shift applied to the entire wave
let left_overhang = -30;

(function () {

  let offset = null;
  let line = null;
  let pts = null;
  let pps = null;

  space.add({
    // Initialize the canvas
    start: (bound) => {
      bound.width = window.innerWidth - scrollbar_padding;
      bound.height = window.innerHeight - navbar_padding;
      space.resize(bound)
    },

    // Animate the canvas via a loop
    animate: (time, ftime) => {
      offset = space.size.$multiply(wave_tilt_angle).y;
      line = new Group(new Pt(left_overhang, offset), new Pt(space.size.x, space.size.y - offset));
      pts = Line.subpoints(line, num_points);

      // Get perpendicular unit vectors from each points on the line
      pps = pts.map((p) => Geom.perpendicular(p.$subtract(line[0]).unit()).add(p));

      // For each point, find and fill a line perpendicular to 
      // the height given by the sin/cos function
      pps.forEach((p, i) => {
        let t = i / num_points * Const.two_pi + Num.cycle(time % repeat_rate / repeat_speed);

        // Alternate the line creation to create the overlap effect
        if (i % 2 === 0) {
          p[0].to(Geom.interpolate(pts[i], p[0], Math.sin(t + wave_phase) * offset * wave_amplitude));
          p[1].to(pts[i]);
          form.stroke(wave_color_first, line_thickness).line(p);
        } 
        else {
          p[0].to(pts[i]);
          p[1].to(Geom.interpolate(pts[i], p[1], Math.cos(t + wave_phase) * offset * wave_amplitude));
          form.stroke(wave_color_second, line_thickness).line(p);
        }
      });
    },
  });

  // Start the animation
  space.play();
})();
