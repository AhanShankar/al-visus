function create_domain_card(domain_name, img_src = "") {
  //returns a 'card' div for the domain. Use for domains -> sorting, linked list etc.
  let card = document.createElement("div");
  card.classList.add("domaincard");

  let card_image = new Image();
  card_image.src = img_src;

  let card_title = document.createElement("div");
  card_title.textContent = domain_name;

  card.appendChild(card_image);
  card.appendChild(card_title);

  return card;
}
let container = document.getElementById("container");

const sorting_card = create_domain_card("Sorting", "./images/sorting.gif");
sorting_card.onclick = function () {
  location.href = "./sorting/index.html";
};
container.appendChild(sorting_card);
