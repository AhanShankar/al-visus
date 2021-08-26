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
      .end()
  ]);
}

async function bubble_sort(arr) {
  console.log("ok");
  for (var i = 0; i < arr.length; i++) {
    // Last i elements are already in place
    for (var j = 0; j < arr.length - i - 1; j++) {
      // Checking if the item at present iteration
      // is greater than the next iteration
      if (arr[j].value > arr[j + 1].value) {
        // If the condition is true then swap them
        await swap_bars(arr[j].node,arr[j+1].node,0);

        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // // let temp=document.querySelector("#bar"+j);
        // document.querySelector("#bar"+j).id="bar"+(j+1);
        // document.querySelector("#bar"+(j+1))="bar"+j;
      }
    }
  }
}
export {bubble_sort};