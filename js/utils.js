import { brandConfig } from "../firebase/firebase-config.js";

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export function formatMoney(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

export function productUrl(product) {
  return `${pathPrefix()}products/details.html?slug=${encodeURIComponent(product.slug || product.id)}`;
}

export function pathPrefix() {
  const path = window.location.pathname.replace(/\\/g, "/");
  if (path.includes("/admin/") || path.includes("/products/")) return "../";
  return "";
}

export function toast(message, tone = "dark") {
  const el = document.createElement("div");
  el.className = `toast toast-${tone}`;
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add("show"));
  setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.remove(), 250);
  }, 2600);
}

export function renderShell(active = "home") {
  const prefix = pathPrefix();
  const header = $("#site-header");
  const footer = $("#site-footer");
  const mobile = $("#mobile-nav");
  const whatsapp = $("#whatsapp-float");

  if (header) {
    header.innerHTML = `
      <nav class="nav-shell" aria-label="Main navigation">
        <div class="nav-inner">
          <button class="nav-toggle" id="nav-toggle" aria-label="Open menu" aria-expanded="false"><span></span></button>
          <a href="${prefix}index.html" class="brand-lockup" aria-label="ThreadMaxx home">
            <img src="${prefix}assets/images/logo.svg" alt="ThreadMaxx" class="brand-mark">
          </a>
          <div class="nav-links" id="nav-links">
            ${navLink(prefix, "index.html", "Home", active === "home")}
            ${navLink(prefix, "products/index.html", "Shop", active === "shop")}
            ${navLink(prefix, "products/index.html?tag=new-arrival", "New Arrivals", false)}
            ${navLink(prefix, "products/index.html?tag=best-seller", "Best Sellers", false)}
            ${navLink(prefix, "account.html", "Orders", active === "account")}
          </div>
          <div class="nav-actions">
            ${navLink(prefix, "products/index.html", "Search", false)}
            ${navLink(prefix, "admin/login.html", "Admin", active === "admin")}
            <a class="cart-link ${active === "cart" ? "active" : ""}" href="${prefix}cart.html">Cart<span class="cart-count" data-cart-count>${cartCount()}</span></a>
          </div>
        </div>
      </nav>`;
  }

  if (footer) {
    footer.innerHTML = `
      <div class="footer-grid">
        <div>
          <div class="brand-lockup mb-4">
            <img src="${prefix}assets/images/logo.svg" alt="" class="brand-mark">
          </div>
          <p class="muted max-w-md">Modern urban clothing shaped around sharp silhouettes, monochrome restraint, and confident everyday wear.</p>
        </div>
        <div>
          <h3>Shop</h3>
          <a href="${prefix}products/index.html?category=kurtis">Kurtis</a>
          <a href="${prefix}products/index.html?category=co-ord-sets">Co-ord Sets</a>
          <a href="${prefix}products/index.html?category=denims">Denims</a>
          <a href="${prefix}products/index.html?category=handbags">Handbags</a>
        </div>
        <div>
          <h3>Support</h3>
          <a href="${prefix}checkout.html">Checkout</a>
          <a href="${prefix}account.html">My Orders</a>
          <a href="mailto:${brandConfig.supportEmail}">${brandConfig.supportEmail}</a>
          <a href="https://wa.me/${brandConfig.supportPhone}">WhatsApp Support</a>
        </div>
        <div>
          <h3>Newsletter</h3>
          <p class="muted">Join the list for early access to new drops and private edits.</p>
          <form class="newsletter-form" id="newsletter-form">
            <input type="email" required placeholder="Email address">
            <button type="submit">Join</button>
          </form>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${new Date().getFullYear()} ThreadMaxx. All rights reserved.</span>
        <span>COD available · Free shipping over ${formatMoney(brandConfig.freeShippingAbove)}</span>
      </div>`;
  }

  if (mobile) {
    mobile.innerHTML = "";
  }

  if (whatsapp) {
    whatsapp.href = `https://wa.me/${brandConfig.supportPhone}?text=${encodeURIComponent("Hi ThreadMaxx, I need help with shopping.")}`;
    whatsapp.innerHTML = `<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M27.1 4.8A15.3 15.3 0 0 0 16.1.3C7.6.3.7 7.2.7 15.7c0 2.7.7 5.3 2.1 7.6L.5 31.7l8.6-2.3a15.4 15.4 0 0 0 7.3 1.9h.1c8.5 0 15.4-6.9 15.4-15.4 0-4.1-1.6-8-4.8-11.1ZM16.5 28.7h-.1a12.8 12.8 0 0 1-6.5-1.8l-.5-.3-5.1 1.3L5.7 23l-.3-.5a12.7 12.7 0 0 1-2-6.8C3.4 8.6 9.2 2.8 16.3 2.8c3.4 0 6.7 1.3 9.1 3.8a12.8 12.8 0 0 1 3.7 9.1c0 7.1-5.7 13-12.6 13Zm7-9.7c-.4-.2-2.4-1.2-2.8-1.3-.4-.1-.7-.2-1 .2s-1.1 1.3-1.3 1.5c-.2.3-.5.3-.9.1-2.5-1.2-4.1-2.1-5.7-4.7-.4-.7.4-.7 1.1-2 .1-.2.1-.5 0-.7s-1-2.3-1.4-3.1c-.4-.9-.8-.7-1.1-.7h-.9c-.3 0-.8.1-1.2.5s-1.6 1.6-1.6 4 1.6 4.6 1.8 4.9c.2.3 3.1 4.8 7.6 6.7 2.8 1.2 3.9 1.3 5.3 1.1.9-.1 2.4-1 2.7-2s.3-1.8.2-2c-.1-.2-.4-.3-.8-.5Z" fill="currentColor"/></svg>`;
  }

  $("#nav-toggle")?.addEventListener("click", (event) => {
    const links = $("#nav-links");
    links?.classList.toggle("open");
    event.currentTarget.setAttribute("aria-expanded", String(links?.classList.contains("open")));
  });
  $("#newsletter-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    toast("You are on the ThreadMaxx list.");
    event.target.reset();
  });

  updateCartCount();
  window.addEventListener("cart:updated", updateCartCount);

  import("./brand-runtime.js")
    .then((module) => module.applyBrandRuntime())
    .catch(() => {});
}

function navLink(prefix, href, label, active) {
  return `<a class="${active ? "active" : ""}" href="${prefix}${href}">${label}</a>`;
}

function cartCount() {
  try {
    return JSON.parse(localStorage.getItem("fashion_hood_cart") || "[]").reduce((sum, item) => sum + Number(item.quantity || 1), 0);
  } catch {
    return 0;
  }
}

function updateCartCount() {
  $$("[data-cart-count]").forEach((item) => {
    item.textContent = cartCount();
  });
}

export function initReveal() {
  const items = $$(".reveal");
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

export function productCard(product) {
  const price = product.salePrice || product.price;
  return `
    <article class="product-card reveal">
      <a href="${productUrl(product)}" class="product-media">
        <img src="${product.images?.[0] || `${pathPrefix()}assets/images/logo.svg`}" alt="${product.name}" loading="lazy">
      </a>
      <div class="product-info">
        <div>
          <a href="${productUrl(product)}" class="product-title">${product.name}</a>
          <p>${labelFromSlug(product.category)}</p>
        </div>
        <div class="price-row">
          <strong>${formatMoney(price)}</strong>
          ${product.salePrice ? `<del>${formatMoney(product.price)}</del>` : ""}
        </div>
      </div>
    </article>`;
}

export function labelFromSlug(slug) {
  return String(slug || "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
