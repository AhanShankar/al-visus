const ARRAY_SORTED_COLOR = "#ED944D";
const ELEMENT_HIGHLIGHT_COLOR = "#6577B3";
const DEFAULT_ELEMENT_COLOR = "#e4c765";
const PSUEDOCDE_HIGHLIGHT_COLOR = "#E3CD81FF";
const POSITIVE_ASSERTION_COLOR = "#48A14D";
const NEGATIVE_ASSERION_COLOR = "#B33F40";
import { populate_psuedocode, indent } from "./codetracer.js";
function swap_bars(node1, node2, time_duration) {
  const bar1 = d3.select(node1);
  const bar2 = d3.select(node2);
  const location1 = bar1.attr("transform");
  const location2 = bar2.attr("transform");

  return Promise.all([
    bar1
      .transition()
      .duration(time_duration)
      .attr(
        "transform",
        "translate" +
          location2.slice(9, location2.indexOf(",")) +
          location1.slice(location1.indexOf(","))
      )
      .end(),

    bar2
      .transition()
      .duration(time_duration)
      .attr(
        "transform",
        "translate" +
          location1.slice(9, location1.indexOf(",")) +
          location2.slice(location2.indexOf(","))
      )
      .end(),
  ]);
}
// this functions chains two animations together, first the coloring
//then decoloring(background:none)
function highlight_psuedocode(node, duration = 100, color) {
  const psuedocode = d3.select(node);
  return psuedocode
    .transition()
    .duration(duration)
    .style("background", color)
    .end()
    .then(() =>
      psuedocode
        .transition()
        .duration(duration)
        .style("background", "none")
        .end()
    );
}
function bubble_sort(arr, time_duration) {
  let animations_array = [];
  let psuedocode_text_arr = [
    "do",
    "swapped = false",
    "for i = 1 to indexOfLastUnsortedElement-1",
    "if leftElement > rightElement",
    "swap(leftElement, rightElement)",
    "swapped = true",
    "while swapped",
  ];
  populate_psuedocode(psuedocode_text_arr);
  
  //indents psuedocode on div, takes an array of indentation values
  //and an optional factor to indent by 
  indent([0, 1, 1, 2, 3, 2, 0], 2);
  let psuedocode_node_arr = Array.from(
    document.querySelectorAll(".psuedocode")
  );
  let swap_occured;

  for (let i = 0; i < arr.length; i++) {
    swap_occured = false;
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[1],
        time_duration,
        NEGATIVE_ASSERION_COLOR
      );
    });
    animations_array.push(() => {
      return highlight_psuedocode(
        psuedocode_node_arr[2],
        time_duration,
        PSUEDOCDE_HIGHLIGHT_COLOR
      );
    });
    for (let j = 0; j < arr.length - i - 1; j++) {
      //temp variables required to pass by value, not reference

      let temp1 = arr[j],
        temp2 = arr[j + 1];

      //push highlighting animation
      if (arr[j].value > arr[j + 1].value) {
        animations_array.push(() => {
          return highlight_psuedocode(
            psuedocode_node_arr[3],
            time_duration,
            POSITIVE_ASSERTION_COLOR
          );
        });
        animations_array.push(() => {
          return highlight_psuedocode(
            psuedocode_node_arr[4],
            time_duration,
            PSUEDOCDE_HIGHLIGHT_COLOR
          );
        });
        animations_array.push(() => {
          return d3
            .select(temp1.node.firstElementChild)
            .transition()
            .duration(time_duration)
            .style("fill", ELEMENT_HIGHLIGHT_COLOR)
            .end();
        });

        // push swapping animation

        animations_array.push(() => {
          return swap_bars(temp1.node, temp2.node, time_duration);
        });
        animations_array.push(() => {
          return highlight_psuedocode(
            psuedocode_node_arr[5],
            time_duration,
            PSUEDOCDE_HIGHLIGHT_COLOR
          );
        });
        //swap actual array

        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swap_occured = true;
      } else {
        animations_array.push(() => {
          return highlight_psuedocode(
            psuedocode_node_arr[3],
            time_duration,
            NEGATIVE_ASSERION_COLOR
          );
        });
        animations_array.push(() => {
          // console.log(j + " " + i+" "+swap_occured);
          return d3
            .select(temp1.node.firstElementChild)
            .transition()
            .duration(0)
            .style("fill", DEFAULT_ELEMENT_COLOR)
            .end();
        });
      }
    }
    if (!swap_occured) break;
  }
  if (!swap_occured) {
    //at this point array is sorted, so push sort complete animation
    animations_array.push(() => {
      return d3
        .selectAll(".rect")
        .transition()
        .duration(1000)
        .style("fill", ARRAY_SORTED_COLOR)
        .end();
    });
  }

  return animations_array;
}
export { bubble_sort };
