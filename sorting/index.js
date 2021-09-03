import { get_sorting_navbar } from "./sorting_navbar.js";
import { bubble_sort } from "./sorting_functions.js";
import * as code_tracer from "./codetracer.js";
document.body.insertBefore(
  get_sorting_navbar(),
  document.body.firstElementChild
); //inserts top navigation bar
const container = document.getElementById("container");
const content = document.getElementById("content");
let is_playing = false;

let x_dim = 1200, //width of graph/chart
  y_dim = 500; //height of graph/chart

let arr = generate_array(10, 0, 300);
append_barchart(arr, x_dim, y_dim);
container.appendChild(get_animation_control_buttons());
const code_trace_div = code_tracer.get_panel();

content.appendChild(code_trace_div);

//test is an object array which can bind nodes and int values together
//in the form of {value,node}

let test = Array.from(document.querySelectorAll(".bar")).map((value, index) => {
  return { value: arr[index], node: value };
});

// animations_array contains all the animations we need to perform
//in order, as functions

let animations_array = bubble_sort(test, 500);
let animation_index = 0;
async function start_animation() {
  for (
    ;
    is_playing && animation_index < animations_array.length;
    animation_index++
  ) {
    await animations_array[animation_index]();
  }
}
function get_animation_control_buttons() {
  const playbutton = document.createElement("button");
  playbutton.id = "play_button";
  playbutton.textContent = "Play";

  playbutton.onclick = function () {
    is_playing = !is_playing;
    if (is_playing) {
      playbutton.textContent = "Pause";
      start_animation();
    } else playbutton.textContent = "Play";
  };

  return playbutton;
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
function generate_array(arr_size, range_min, range_max) {
  let arr = [];
  for (let i = 0; i < arr_size; i++)
    arr.push(getRandomArbitrary(range_min, range_max) | 0);
  return arr;
}

function append_barchart(arr, x_dim, y_dim) {
  const margin = { left: 50, top: 10, right: 50, bottom: 30 };

  const getRatio = (side) => (margin[side] / x_dim) * 100 + "%";

  const marginRatio = {
    left: getRatio("left"),
    top: getRatio("top"),
    right: getRatio("right"),
    bottom: getRatio("bottom"),
  };
  const xscale = d3
    .scaleBand()
    .domain(arr.map((item, index) => index))
    .rangeRound([0, x_dim])
    .padding(0.2);

  const yscale = d3.scaleLinear().domain([0, 400]).range([y_dim, 0]);

  const svg = d3
    .select("#container")
    .append("svg")
    .style(
      "padding",
      marginRatio.top +
        " " +
        marginRatio.right +
        " " +
        marginRatio.bottom +
        " " +
        marginRatio.left +
        " "
    )
    .attr("preserveAspectRatio", "xMinYMin meet")
    .attr(
      "viewBox",
      "0 0 " +
        (x_dim + margin.left + margin.right) +
        " " +
        (y_dim + margin.top + margin.bottom)
    );

  let chart = svg //g element which contains the bar and text
    .selectAll("g")
    .data(arr)
    .enter()
    .append("g")
    .classed("bar", true)
    .attr("id", (d, i) => "bar" + i)
    .attr("transform", (d, i) => `translate(${xscale(i)},${yscale(d)})`);

  chart
    .append("rect")
    .style("height", (d) => y_dim - yscale(d))
    .classed("rect", true)
    .attr("width", xscale.bandwidth());

  if (arr.length <= 20)
    chart
      .append("text") //text
      .attr("x", (d, i) => xscale.bandwidth() / 2)
      .attr("y", (d) => 10)
      .attr("dy", "0.35em")
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .text((d) => {
        if (d > 15) return d; // values less than 15 are too small to contain text
      });
}
