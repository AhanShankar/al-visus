const SWAP_COMPLETED_COLOR='orange';
const ELEMENT_HIGHLIGHT_COLOR='#3a78b5';
const DEFAULT_ELEMENT_COLOR= "rgb(198 223 202)"
function swap_bars(i, j, time_duration) {
  const bar1 = d3.select(i);
  const bar2 = d3.select(j);
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

async function bubble_sort(arr, time_duration) {
  let already_sorted_arr = arr.sort((a, b) => a - b);
  let swap_occured;
  do {
    swap_occured = false;
    for (var i = 0; i < arr.length; i++) {
      for (var j = 0; j < arr.length - i - 1; j++) {
        if (arr[j].value > arr[j + 1].value) {
          arr[j].node.firstElementChild.style["fill"] = "red";
          // If the condition is true then swap animation
          await swap_bars(arr[j].node, arr[j + 1].node, time_duration);

          var temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swap_occured = true;
          if (arr[j + 1] === already_sorted_arr[j + 1]) {
            arr[j + 1].node.firstElementChild.style["fill"] = ELEMENT_HIGHLIGHT_COLOR;
          }
        } else {
          arr[j].node.firstElementChild.style["fill"] = DEFAULT_ELEMENT_COLOR;
        }
      }
    }
  } while (swap_occured);
  if (!swap_occured) {
    d3.selectAll('.rect').style('fill',SWAP_COMPLETED_COLOR);
  }
}
export { bubble_sort };
