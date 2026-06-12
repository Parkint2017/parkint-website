/* Park International - site behaviours */
(function () {
  "use strict";

  /* ---------- Language ---------- */
  var saved = null;
  try { saved = localStorage.getItem("pi_lang"); } catch (e) {}
  var lang = saved === "en" ? "en" : "ko";
  function applyLang(l) {
    lang = l;
    document.documentElement.setAttribute("data-lang", l);
    try { localStorage.setItem("pi_lang", l); } catch (e) {}
    var btns = document.querySelectorAll("[data-lang-btn]");
    for (var i = 0; i < btns.length; i++) {
      btns[i].classList.toggle("active", btns[i].getAttribute("data-lang-btn") === l);
    }
    var t = document.querySelector("title[data-ko]");
    if (t) { document.title = t.getAttribute("data-" + l) || document.title; }
  }
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-lang-btn]");
    if (btn) { applyLang(btn.getAttribute("data-lang-btn")); }
  });
  function tx(en, ko) { return lang === "en" ? en : ko; }

  /* ---------- Mobile nav ---------- */
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.querySelector(".nav");
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () { nav.classList.toggle("open"); });
    var links = nav.querySelectorAll("a");
    for (var k = 0; k < links.length; k++) {
      links[k].addEventListener("click", function () { nav.classList.remove("open"); });
    }
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector(".site-header");
  window.addEventListener("scroll", function () {
    if (!header) { return; }
    header.style.boxShadow = window.scrollY > 10 ? "0 6px 20px rgba(11,46,99,.08)" : "none";
  });

  /* ---------- Scroll reveal ---------- */
  var io = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add("in");
        io.unobserve(entries[i].target);
      }
    }
  }, { threshold: 0.12 });
  function observeAll(scope) {
    var els = (scope || document).querySelectorAll(".reveal");
    for (var i = 0; i < els.length; i++) { io.observe(els[i]); }
  }
  observeAll(document);

  /* ---------- FAQ ---------- */
  var faqs = document.querySelectorAll(".faq-q");
  for (var f = 0; f < faqs.length; f++) {
    faqs[f].addEventListener("click", function () {
      this.parentElement.classList.toggle("open");
    });
  }

  /* ---------- Events / Gallery data ---------- */
  var eventsHost = document.getElementById("events-host");
  var galleryHost = document.getElementById("gallery-host");
  var homeEvents = document.getElementById("home-events");
  var flat = [];

  function pinSvg() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>';
  }
  function eventCard(e, href) {
    var gov = e.govLogo ? '<span class="gov"><img src="' + e.govLogo + '" alt=""></span>' : '';
    var play = e.videoUrl ? '<span class="playbtn"></span>' : '';
    var url = e.videoUrl || href;
    var tgt = e.videoUrl ? ' target="_blank" rel="noopener"' : '';
    return '<a class="event-card reveal" href="' + url + '"' + tgt + '>' +
      '<div class="thumb" style="background-image:url(' + e.cover + ')"><span class="yr">' + e.year + '</span>' + gov + play + '</div>' +
      '<div class="body">' +
      '<h3><span class="lang-en">' + e.title_en + '</span><span class="lang-ko">' + e.title_ko + '</span></h3>' +
      '<span class="loc">' + pinSvg() +
      '<span class="lang-en">' + e.loc_en + '</span><span class="lang-ko">' + e.loc_ko + '</span></span>' +
      '</div></a>';
  }

  function renderEvents(data) {
    if (!eventsHost) { return; }
    eventsHost.innerHTML = data.map(function (e) {
      return eventCard(e, "gallery.html#" + e.slug);
    }).join("");
    observeAll(eventsHost);
  }

  function renderHomeEvents(data) {
    if (!homeEvents) { return; }
    homeEvents.innerHTML = data.slice(0, 3).map(function (e) {
      return eventCard(e, "events.html");
    }).join("");
    observeAll(homeEvents);
  }

  function renderGallery(data) {
    if (!galleryHost) { return; }
    flat = [];
    galleryHost.innerHTML = data.map(function (e) {
      var imgs = e.photos.map(function (p) {
        var idx = flat.length;
        flat.push(p.full);
        return '<img loading="lazy" src="' + p.thumb + '" data-full="' + p.full + '" data-idx="' + idx + '" alt="' + e.title_en + '">';
      }).join("");
      var govInline = e.govLogo ? ' <img class="gov-inline" src="' + e.govLogo + '" alt="">' : '';
      return '<div class="gallery-group reveal" id="' + e.slug + '">' +
        '<h3><span class="yr" style="position:static;display:inline-block">' + e.year + '</span> ' +
        '<span class="lang-en">' + e.title_en + '</span><span class="lang-ko">' + e.title_ko + '</span>' + govInline + '</h3>' +
        '<div class="meta"><span class="lang-en">' + e.loc_en + '</span><span class="lang-ko">' + e.loc_ko + '</span></div>' +
        '<div class="gallery-body">' +
          (e.videoUrl && !e.photos.length
            ? '<a class="video-card" href="' + e.videoUrl + '" target="_blank" rel="noopener" style="background-image:url(' + e.cover + ')"><span class="playbtn lg"></span><span class="vlabel"><span class="lang-en">Watch on YouTube</span><span class="lang-ko">유튜브에서 보기</span></span></a>'
            : '<div class="gallery-grid">' + imgs + '</div>') +
        '</div></div>';
    }).join("");
    observeAll(galleryHost);
    setupLightbox();
    if (location.hash) {
      var el = document.getElementById(location.hash.slice(1));
      if (el) { setTimeout(function () { el.scrollIntoView({ behavior: "smooth" }); }, 200); }
    }
  }

  if (eventsHost || galleryHost || homeEvents) {
    var dataPromise = window.PI_EVENTS
      ? Promise.resolve(window.PI_EVENTS)
      : fetch("assets/events.json").then(function (r) { return r.json(); });
    dataPromise.then(function (data) {
      renderEvents(data);
      renderGallery(data);
      renderHomeEvents(data);
    }).catch(function (err) { console.error("events data load failed", err); });
  }

  /* ---------- Lightbox ---------- */
  function setupLightbox() {
    var lb = document.getElementById("lightbox");
    if (!lb) { return; }
    var img = lb.querySelector("img");
    var cur = 0;
    function show(i) { cur = (i + flat.length) % flat.length; img.src = flat[cur]; }
    var thumbs = document.querySelectorAll(".gallery-grid img");
    for (var i = 0; i < thumbs.length; i++) {
      (function (t) {
        t.addEventListener("click", function () {
          show(parseInt(t.getAttribute("data-idx"), 10));
          lb.classList.add("open");
        });
      })(thumbs[i]);
    }
    lb.querySelector(".close").addEventListener("click", function () { lb.classList.remove("open"); });
    lb.querySelector(".prev").addEventListener("click", function (e) { e.stopPropagation(); show(cur - 1); });
    lb.querySelector(".next").addEventListener("click", function (e) { e.stopPropagation(); show(cur + 1); });
    lb.addEventListener("click", function (e) { if (e.target === lb) { lb.classList.remove("open"); } });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) { return; }
      if (e.key === "Escape") { lb.classList.remove("open"); }
      if (e.key === "ArrowLeft") { show(cur - 1); }
      if (e.key === "ArrowRight") { show(cur + 1); }
    });
  }

  /* ---------- Contact form (mailto fallback) ---------- */
  var cform = document.getElementById("contact-form");
  if (cform) {
    cform.addEventListener("submit", function (e) {
      e.preventDefault();
      var nm = cform.name.value || "";
      var em = cform.email.value || "";
      var ms = cform.message.value || "";
      var subject = tx("Website inquiry from ", "homepage inquiry - ") + nm;
      var body = "Name: " + nm + "\r\nEmail: " + em + "\r\n\r\n" + ms;
      window.location.href = "mailto:Contact@parkltd.net?subject=" +
        encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  }

  /* ---------- init ---------- */
  applyLang(lang);
  var yrs = document.querySelectorAll("[data-year]");
  for (var y = 0; y < yrs.length; y++) {
    if (yrs[y].tagName === "SPAN") { yrs[y].textContent = new Date().getFullYear(); }
  }
})();
