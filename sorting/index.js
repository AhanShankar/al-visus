import { get_sorting_navbar } from "./sorting_navbar.js";

document.body.insertBefore(
  get_sorting_navbar(),
  document.body.firstElementChild
);

let arr = [23, 55, 132, 377, 35, 27, 53];
const xscale = d3
  .scaleBand()
  .domain(arr.map((item, index) => index))
  .rangeRound([0, 400])
  .padding(0.2);
// console.log(xscale);
const yscale = d3.scaleLinear().domain([0, 400]).range([400, 0]);
console.log(yscale(55));
d3.select("#container")
  .selectAll(".bar")
  .data(arr)
  .enter()
  .append("rect")
  .classed("bar", true)
  .text((d) => d)
  .style("height", (d) => 400 - yscale(d) + "px")
  .attr("width", xscale.bandwidth() + "px")
  .attr("x", (d, i) => xscale(i))
  .attr("y", (d) => yscale(d));
