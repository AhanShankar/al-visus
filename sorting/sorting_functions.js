const ARRAY_SORTED_COLOR = "orange";
const ELEMENT_HIGHLIGHT_COLOR = "#3a78b5";
const DEFAULT_ELEMENT_COLOR = "rgb(198 223 202)";
import { populate_psuedocode } from "./codetracer.js";
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

function bubble_sort(arr, time_duration) {
  let animations_array = [];
  // let already_sorted_arr = arr.sort((a, b) => a - b);
  let psuedocode_arr = [
    "do",
    "swapped = false",
    "for i = 1 to indexOfLastUnsortedElement-1",
    "if leftElement > rightElement",
    "swap(leftElement, rightElement)",
    "swapped = true",
    "while swapped",
  ];
  populate_psuedocode(psuedocode_arr);
  let swap_occured;
  for (let i = 0; i < arr.length; i++) {
    swap_occured = false;
    for (let j = 0; j < arr.length - i - 1; j++) {
      //temp variables required to pass by value, not reference

      let temp1 = arr[j],
        temp2 = arr[j + 1];

      //push highlighting animation

      if (arr[j].value > arr[j + 1].value) {
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

        //swap actual array

        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        swap_occured = true;
      } else {
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
