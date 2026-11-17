/* Renders photos.json into every element with class "photo-strip".
   photos.json: [{ "file": "photos/x.jpg", "caption": "...", "sections": ["all"] }]
   A page can set data-section on the strip to filter; default shows all. */
(function () {
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = '<img alt=""><div class="cap"></div>';
  lb.onclick = function () { lb.classList.remove("open"); };
  document.body.appendChild(lb);

  fetch("photos.json", { cache: "no-store" })
    .then(function (r) { return r.json(); })
    .then(function (photos) {
      document.querySelectorAll(".photo-strip").forEach(function (strip) {
        var limit = parseInt(strip.dataset.limit || "0", 10);
        var list = limit ? photos.slice(0, limit) : photos;
        list.forEach(function (p) {
          var fig = document.createElement("figure");
          var img = document.createElement("img");
          img.loading = "lazy";
          img.src = p.file;
          img.alt = p.caption || "";
          img.onclick = function () {
            lb.querySelector("img").src = p.file;
            lb.querySelector(".cap").textContent = p.caption || "";
            lb.classList.add("open");
          };
          var cap = document.createElement("figcaption");
          cap.textContent = p.caption || "";
          fig.appendChild(img);
          fig.appendChild(cap);
          strip.appendChild(fig);
        });
        if (!list.length) {
          strip.innerHTML = '<p class="note">[Photos pending selection]</p>';
        }
      });
    })
    .catch(function () {});
})();
