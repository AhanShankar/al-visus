import { get_sorting_navbar } from "./sorting_navbar.js";
import { SortingFunctions } from "./sorting_functions.js";
import * as code_tracer from "./codetracer.js";
const ARRAY_SIZE = 20;
const nav_bar = get_sorting_navbar();
document.body.insertBefore(nav_bar, document.body.firstElementChild); //inserts top navigation bar
const container = document.getElementById("container");
const content = document.getElementById("content");
const create_array_button = get_createarray_button();
let is_playing = false;

let input_field = array_input();
let current_sort = SortingFunctions[0];
let x_dim = 1200, //width of graph/chart
  y_dim = 500; //height of graph/chart

let arr = generate_array(ARRAY_SIZE, 10, 300);
append_barchart(arr, x_dim, y_dim);
container.appendChild(input_field);
container.appendChild(create_array_button);
container.appendChild(get_animation_control_buttons());
const code_trace_div = code_tracer.get_panel();
let animations_array = [];
for (
  let sorting_option = nav_bar.firstChild, i = 0;
  sorting_option !== null;
  sorting_option = sorting_option.nextSibling, i++
) {
  sorting_option.onclick = function () {
    is_playing=false;
    animation_index=0;
    arr = generate_array(ARRAY_SIZE, 10, 300);
    while (container.firstElementChild)
      container.removeChild(container.firstElementChild);
    while (code_trace_div.firstElementChild)
      code_trace_div.removeChild(code_trace_div.firstElementChild);
    append_barchart(arr, x_dim, y_dim);
    container.appendChild(get_animation_control_buttons());
    current_sort = SortingFunctions[i];
    animations_array = current_sort(
      Array.from(document.querySelectorAll(".bar")).map((value, index) => {
        return { value: arr[index], node: value };
      }),
      120
    );
  };
}
content.appendChild(code_trace_div);

//test is an object array which can bind nodes and int values together
//in the form of {value,node}

let test = Array.from(document.querySelectorAll(".bar")).map((value, index) => {
  return { value: arr[index], node: value };
});
// animations_array contains all the animations we need to perform
//in order, as functions

animations_array = current_sort(test, 120);

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

function array_input() {
    const input = document.createElement("input");
    input.id = "input_arr";
    input.setAttribute("type", "text");
    return input;
}

function get_createarray_button() {
  const createbutton = document.createElement("button");
  createbutton.id = "createbutton";
  createbutton.textContent = "Create";

  return createbutton;
}

create_array_button.onclick = function () {
  let str = input_field.value;
  let string_array = str.split(',');
  string_array = string_array.map( (string) => {
    return +string;
  });
  arr = string_array;
  animation_index = 0;
  is_playing = false;
  while(container.firstElementChild){
    container.removeChild(container.firstElementChild)
  }
  append_barchart(arr,x_dim,y_dim);
  container.appendChild(input_field);
  container.appendChild(create_array_button);
  container.appendChild(get_animation_control_buttons());
  animations_array = insertion_sort(Array.from(document.querySelectorAll(".bar")).map((value, index) => {
    return { value: arr[index], node: value };
  }),500)
  console.log(string_array);
};

function get_animation_control_buttons() {
  const playbutton = document.createElement("button");
  playbutton.id = "play_button";
  playbutton.textContent = "⏸";

  playbutton.onclick = function () {
    is_playing = !is_playing;
    if (is_playing) {
      playbutton.textContent = "▶";
      start_animation();
    } else playbutton.textContent = "⏸";
    // if (e.which == 32) { 
    //   if (!is_playing){ 
    //   playbutton.textContent = "▶"; 
    //   start_animation(); } 
    //   else playbutton.textContent = "⏸"; 
    //   }      
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
