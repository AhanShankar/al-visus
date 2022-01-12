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
  do {
    swap_occured = false;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        //temp variables required to pass by value, not reference

        let temp1 = arr[j],
          temp2 = arr[j + 1];

        //push highlighting animation

        if (arr[j].value > arr[j + 1].value) { 
          animations_array.push(() => {
            temp1.node.firstElementChild.style["fill"] =
              ELEMENT_HIGHLIGHT_COLOR;
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

          //following code doesnt work

          // if (arr[j+1] === already_sorted_arr[j + 1]) {
          //   console.log('ok');
          //   animations_array.push(()=>{
          //   return d3.select(temp2.node.firstElementChild).transition().style("fill",
          //     ELEMENT_HIGHLIGHT_COLOR).end();
          // });}
        } else {
          animations_array.push(() => {
            temp1.node.firstElementChild.style["fill"] = DEFAULT_ELEMENT_COLOR;
          });
        }
      }
    }
  } while (swap_occured);
  if (!swap_occured) {
    
    //at this point array is sorted, so push sort complete animation

    animations_array.push(() => {
      d3.selectAll(".rect").style("fill", ARRAY_SORTED_COLOR);
    });
  }
  return animations_array;
}
export { bubble_sort };
