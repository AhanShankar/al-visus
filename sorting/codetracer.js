let code_tracer_div;
function get_panel() {
  code_tracer_div = document.createElement("div");
  code_tracer_div.id = "code_trace_panel";
  return code_tracer_div;
}
function get_psuedocode_div(psuedocode) {
  let div = document.createElement("div");
  div.textContent = psuedocode;
  div.classList.add("psuedocode");
  return div;
}

//this takes an array of strings, which will be different for every sorting algorithm
function populate_psuedocode(arr) {
  console.log(arr);
  for (const psuedocode of arr) {
    console.log(psuedocode);
    code_tracer_div.appendChild(get_psuedocode_div(psuedocode));
  }
}

export { get_panel, populate_psuedocode };
