document.addEventListener("card:added", (event) => {
  const parser = new DOMParser();
  const newCartPreview = parser.parseFromString(event.detail.header, "text/html");
  let cartPreview = document.getElementById("cart-quantity");
  cartPreview.innerHTML = newCartPreview.getElementById("cart-quantity").innerHTML;
});
