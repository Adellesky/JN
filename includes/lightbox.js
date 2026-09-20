/* Gallery lightbox with download — no changes to index.html needed.
   Add before </body>:  <script src="lightbox.js"></script>  */
(function () {
  var css = `
    .featured_projects .img { cursor: pointer; }
    .lb {
      position: fixed; inset: 0; z-index: 9999;
      display: none; align-items: center; justify-content: center;
      background: rgba(10, 14, 20, 0.92);
    }
    .lb.open { display: flex; }
    .lb-img {
      max-width: 92vw; max-height: 80vh;
      border-radius: 6px; box-shadow: 0 10px 40px rgba(0,0,0,.5);
    }
    .lb-bar {
      position: absolute; left: 0; right: 0; bottom: 20px;
      display: flex; justify-content: center; align-items: center; gap: 14px;
      font-family: Arial, sans-serif; color: #fff;
    }
    .lb-btn, .lb-download {
      background: #0a86a8; color: #fff; border: 0; border-radius: 6px;
      padding: 10px 18px; font-size: 15px; text-decoration: none; cursor: pointer;
    }
    .lb-btn:hover, .lb-download:hover { background: #086a85; }
    .lb-count { font-size: 14px; opacity: .8; min-width: 60px; text-align: center; }
    .lb-close {
      position: absolute; top: 14px; right: 20px;
      background: none; border: 0; color: #fff; font-size: 38px; cursor: pointer; line-height: 1;
    }
    @media (max-width: 480px) { .lb-btn, .lb-download { padding: 9px 12px; font-size: 14px; } }
  `;
  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var lb = document.createElement("div");
  lb.className = "lb";
  lb.innerHTML =
    '<button class="lb-close" aria-label="Close">&times;</button>' +
    '<img class="lb-img" alt="">' +
    '<div class="lb-bar">' +
      '<button class="lb-btn lb-prev">&#8592; Prev</button>' +
      '<span class="lb-count"></span>' +
      '<a class="lb-download" download>Download</a>' +
      '<button class="lb-btn lb-next">Next &#8594;</button>' +
    '</div>';
  document.body.appendChild(lb);

  var big = lb.querySelector(".lb-img");
  var dl = lb.querySelector(".lb-download");
  var count = lb.querySelector(".lb-count");
  var cards = Array.prototype.slice.call(
    document.querySelectorAll(".featured_projects .img")
  );
  var index = 0;

  function srcOf(card) {
    var img = card.querySelector("img");
    return img ? img.getAttribute("src") : null;
  }

  function show(i) {
    index = (i + cards.length) % cards.length;
    var src = srcOf(cards[index]);
    big.src = src;
    dl.href = src;
    dl.setAttribute("download", src.split("/").pop());
    count.textContent = (index + 1) + " / " + cards.length;
  }

  function open(i) { show(i); lb.classList.add("open"); document.body.style.overflow = "hidden"; }
  function close() { lb.classList.remove("open"); document.body.style.overflow = ""; }

  // Clicking anywhere on a card (even on the overlay layer) opens it
  cards.forEach(function (card, i) {
    card.addEventListener("click", function () { open(i); });
  });

  lb.querySelector(".lb-close").addEventListener("click", close);
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(index - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(index + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });

  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
})();