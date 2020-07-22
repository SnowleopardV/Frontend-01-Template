import Timeline from './timeline.js'
import {Animation, ColorAnimation} from './animation.js'
import cub from './cubicBezier.js'

let cubicBezier = {
    linear: v => v,
    ease: cub(.25,.1,.25,1),
    easeIn: cub(.42,0,1,1),
    easeOut: cub(.17,.67,.83,.67),
    easeInOut: cub(.17,.67,.83,.67)
};


let el = document.getElementById('el');
let el2 = document.getElementById('el2');
let el3 = document.getElementById('el3');
let el4 = document.getElementById('el4');
let linear = v => v;
let animation = new Animation({
  object: el.style,
  property: "transform",
  start: 0,
  end: 900,
  duration: 10000,
  delay: 0,
  template: v => `translate(${v}px)`,
  timingFunction: linear
});

let ls = new Timeline;
ls.add(animation);
ls.start();


document.getElementById('btn2').addEventListener('click', () => {ls.pause()});
document.getElementById('btn3').addEventListener('click', () => {ls.resume()});
document.getElementById('btn4').addEventListener('click', () => {ls.restart()});

let animation2 = new Animation({
  object: el2.style,
  property: "transform",
  start: 0,
  end: 400,
  duration: 5000,
  delay: 0,
  template: v => `translate(${v}px)`,
  timingFunction: linear
});
document.getElementById('btn5').addEventListener('click', () => {ls.add(animation2)});
document.getElementById('btn6').addEventListener('click', () => {ls.fastforward()});

let animation3 = new ColorAnimation({
  object: el3.style,
  property: "background",
  start: {r : 0, g: 0, b: 0, a: 1},
  end: {r : 255, g: 0, b: 0, a: 1},
  duration: 5000,
  delay: 0,
  template: v => `rgba(${v.r}, ${v.g}, ${v.b}, ${v.a})`,
  timingFunction: linear
});

let animation4 = new Animation({
  object: [el4.style, el4.style],
  property: ["width","height"],
  start: 200,
  end: 600,
  duration: 5000,
  delay: 0,
  template: v => `${v}px`,
  timingFunction: linear
});

ls.add(animation3);
ls.add(animation4);
ls.start();