import { getProductBySlug } from "../firebase/firestore-service.js";
import { addToCart, clearCart, saveCart } from "./cart-service.js";
import { fallbackProducts } from "./data.js";
import { $, formatMoney, getParam, labelFromSlug, renderShell, toast } from "./utils.js";

renderShell("shop");

const slug = getParam("slug");
const liveProduct = await getProductBySlug(slug).catch(() => null);
const product = liveProduct || fallbackProducts.find((item) => item.slug === slug || item.id === slug);
const root = $("#product-detail");

if (!product) {
  root.innerHTML = `<div><h1 class="section-title">Product not found</h1><p class="muted mt-4">This item may be sold out or unpublished.</p><a class="btn-dark mt-6" href="index.html">Back to shop</a></div>`;
} else {
  document.title = `${product.name} | ThreadMaxx`;
  const images = product.images?.length ? product.images : ["../assets/images/logo.svg"];
  root.innerHTML = `
    <div class="product-gallery">
      <div class="gallery-main"><img id="main-image" src="${images[0]}" alt="${product.name}" fetchpriority="high"></div>
      <div class="thumb-row">${images.map((image, index) => `<button class="${index === 0 ? "active" : ""}" data-image="${image}"><img src="${image}" alt=""></button>`).join("")}</div>
    </div>
    <div class="summary-card product-panel">
      <span class="eyebrow">${labelFromSlug(product.category)}</span>
      <h1 class="section-title mt-4">${product.name}</h1>
      <div class="product-rating"><strong>5.0</strong><span>ThreadMaxx verified fit</span><span>Stock: ${product.stock ?? "Live"}</span></div>
      <div class="price-row text-left mt-5">
        <strong class="text-3xl">${formatMoney(product.salePrice || product.price)}</strong>
        ${product.salePrice ? `<del>${formatMoney(product.price)}</del>` : ""}
      </div>
      <p class="muted mt-5">${product.description || "Premium ThreadMaxx piece with a clean fit, sharp finish and confident everyday silhouette."}</p>
      <div class="mt-6">
        <h3 class="font-black mb-3">Size</h3>
        <div class="option-row">${(product.sizes || ["One Size"]).map((size, index) => option("size", size, index === 0)).join("")}</div>
      </div>
      <div class="mt-6">
        <h3 class="font-black mb-3">Color</h3>
        <div class="option-row">${(product.colors || ["Default"]).map((color, index) => option("color", color, index === 0)).join("")}</div>
      </div>
      <div class="mt-6">
        <h3 class="font-black mb-3">Quantity</h3>
        <div class="qty-control">
          <button type="button" id="qty-dec" aria-label="Decrease quantity">-</button>
          <input id="qty-input" value="1" readonly aria-label="Quantity">
          <button type="button" id="qty-inc" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="desktop-purchase mt-6 grid grid-cols-2 gap-3">
        <button class="btn-primary" id="add-cart">Add to Cart</button>
        <button class="btn-dark" id="buy-now">Buy Now</button>
      </div>
      <div class="product-meta">
        <span>COD available at checkout</span>
        <span>WhatsApp support before purchase</span>
        <span>Material and care details confirmed with each live product listing</span>
      </div>
    </div>
    <div class="mobile-purchase-bar">
      <button class="btn-secondary" id="mobile-add-cart">Add to Cart</button>
      <button class="btn-primary" id="mobile-buy-now">Buy Now</button>
    </div>`;

  let quantity = 1;
  const qtyInput = $("#qty-input");

  function setQuantity(value) {
    quantity = Math.max(1, Math.min(10, Number(value) || 1));
    qtyInput.value = quantity;
  }

  root.querySelectorAll(".thumb-row button").forEach((button) => {
    button.addEventListener("click", () => {
      $("#main-image").src = button.dataset.image;
      root.querySelectorAll(".thumb-row button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  $("#qty-dec").addEventListener("click", () => setQuantity(quantity - 1));
  $("#qty-inc").addEventListener("click", () => setQuantity(quantity + 1));

  function selectedOptions() {
    return {
      size: root.querySelector("input[name=size]:checked")?.value,
      color: root.querySelector("input[name=color]:checked")?.value,
      quantity
    };
  }

  function handleAddToCart() {
    const size = root.querySelector("input[name=size]:checked")?.value;
    const color = root.querySelector("input[name=color]:checked")?.value;
    addToCart(product, { size, color, quantity });
    if (typeof fbq !== "undefined") fbq("track", "AddToCart");
  }

  function handleBuyNow() {
    clearCart();
    const selected = selectedOptions();
    saveCart([{
      key: `${product.id}-${selected.size || "default"}-${selected.color || "default"}`,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      image: product.images?.[0] || "",
      price: product.salePrice || product.price,
      mrp: product.price,
      size: selected.size || product.sizes?.[0] || "One Size",
      color: selected.color || product.colors?.[0] || "Default",
      quantity: selected.quantity
    }]);
    window.location.href = "../checkout.html";
  }

  $("#add-cart").addEventListener("click", handleAddToCart);
  $("#mobile-add-cart").addEventListener("click", handleAddToCart);
  $("#buy-now").addEventListener("click", handleBuyNow);
  $("#mobile-buy-now").addEventListener("click", handleBuyNow);

  let touchStartX = 0;
  $(".gallery-main").addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });
  $(".gallery-main").addEventListener("touchend", (event) => {
    const delta = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(delta) < 40 || images.length < 2) return;
    const current = images.indexOf($("#main-image").src);
    const active = [...root.querySelectorAll(".thumb-row button")].findIndex((button) => button.classList.contains("active"));
    const currentIndex = current >= 0 ? current : active;
    const nextIndex = delta < 0 ? (currentIndex + 1) % images.length : (currentIndex - 1 + images.length) % images.length;
    root.querySelectorAll(".thumb-row button")[nextIndex].click();
  }, { passive: true });
}

function option(name, value, checked) {
  return `<label><input type="radio" name="${name}" value="${value}" ${checked ? "checked" : ""}><span>${value}</span></label>`;
}
