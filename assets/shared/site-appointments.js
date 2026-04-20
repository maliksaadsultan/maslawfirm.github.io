(function () {
  var BUSINESS = {
    phoneDisplay: "+92 313 5626627",
    phoneRaw: "923135626627",
    email: "mastaxlawfirm@gmail.com",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Khanpur+Road+front+of+UET+Taxila+main+gate+P.O.+Box+and+Tehsil+Taxila+District+Rawalpindi+Pakistan",
  };

  function text(el) {
    return (el && (el.textContent || "").trim()) || "";
  }

  function ensureParticlesContainer() {
    var existing = document.getElementById("anjum-particles");
    if (existing) return existing;
    var node = document.createElement("div");
    node.id = "anjum-particles";
    document.body.insertBefore(node, document.body.firstChild);
    return node;
  }

  function loadScriptOnce(src, callback) {
    var existing = document.querySelector('script[data-anjum-src="' + src + '"]');
    if (existing) {
      if (existing.dataset.loaded === "true") callback();
      else existing.addEventListener("load", callback, { once: true });
      return;
    }

    var script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.anjumSrc = src;
    script.addEventListener("load", function () {
      script.dataset.loaded = "true";
      callback();
    }, { once: true });
    document.body.appendChild(script);
  }

  function initParticlesBackground() {
    if (window.__anjumParticlesInitialized) return;
    ensureParticlesContainer();

    loadScriptOnce("/assets/shared/particles.min.js", function () {
      if (!window.particlesJS || window.__anjumParticlesInitialized) return;

      window.particlesJS("anjum-particles", {
        particles: {
          number: {
            value: 42,
            density: {
              enable: true,
              value_area: 980,
            },
          },
          color: {
            value: ["#0b3f58", "#156987", "#f4b545", "#ff7a59"],
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.34,
            random: true,
            anim: {
              enable: true,
              speed: 0.7,
              opacity_min: 0.12,
              sync: false,
            },
          },
          size: {
            value: 6.5,
            random: true,
            anim: {
              enable: true,
              speed: 2.2,
              size_min: 1.5,
              sync: false,
            },
          },
          line_linked: {
            enable: true,
            distance: 210,
            color: "#175f81",
            opacity: 0.2,
            width: 1.2,
          },
          move: {
            enable: true,
            speed: 2.4,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            attract: {
              enable: false,
            },
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: false,
            },
            onclick: {
              enable: false,
            },
            resize: true,
          },
        },
        retina_detect: true,
      });

      window.__anjumParticlesInitialized = true;
    });
  }

  function pickTitle() {
    var heading = document.querySelector(".page-wrapper h1, .page-wrapper .kc_title, .page__title__wrapper h2");
    if (heading) return text(heading);
    return document.title.split("|")[0].trim();
  }

  function addAppointmentMeta(form, title) {
    if (form.querySelector(".anjum-appointment-meta")) return;
    var meta = document.createElement("div");
    meta.className = "anjum-appointment-meta";
    meta.innerHTML =
      '<span class="anjum-appointment-eyebrow">Appointment Request</span>' +
      "<p>Share your details below. We will open WhatsApp with a prefilled request so you can send it instantly from this static site.</p>" +
      '<div class="anjum-appointment-actions">' +
      '<a href="tel:' + BUSINESS.phoneRaw + '">Call</a>' +
      '<a href="mailto:' + BUSINESS.email + '?subject=' + encodeURIComponent("Consultation Request - " + title) + '">Email</a>' +
      '<a href="https://wa.me/' + BUSINESS.phoneRaw + '?text=' + encodeURIComponent("Hello MAS Law Firm, I want to book a consultation regarding " + title + ".") + '" target="_blank" rel="noopener">WhatsApp</a>' +
      '<a href="' + BUSINESS.mapsUrl + '" target="_blank" rel="noopener">Open Map</a>' +
      "</div>";
    form.insertBefore(meta, form.firstChild);
  }

  function applyFieldEnhancements(form) {
    var fields = form.querySelectorAll("input[type='text'], input[type='email'], input[type='date'], textarea");
    var placeholders = [
      "Your full name",
      "you@example.com",
      "What do you need help with?",
      "",
      "Share your issue, business type, and preferred contact time.",
    ];

    fields.forEach(function (field, index) {
      field.placeholder = placeholders[index] || field.placeholder || "";
      if (field.type !== "date") field.setAttribute("autocomplete", "off");
      if (index === 0 || index === 1 || index === 2 || field.tagName === "TEXTAREA") {
        field.required = true;
      }
    });

    var submit = form.querySelector("input[type='submit']");
    if (submit) submit.value = "Continue on WhatsApp";
  }

  function ensureResponseOutput(form) {
    var output = form.querySelector(".wpcf7-response-output");
    if (!output) {
      output = document.createElement("div");
      output.className = "wpcf7-response-output";
      form.appendChild(output);
    }
    output.classList.remove("wpcf7-display-none");
    output.hidden = true;
    return output;
  }

  function handleSubmit(form, title) {
    var output = ensureResponseOutput(form);

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.reportValidity()) {
        output.hidden = false;
        output.textContent = "Please complete the required fields before continuing.";
        output.className = "wpcf7-response-output anjum-form-status is-error";
        return;
      }

      var fields = form.querySelectorAll("input[type='text'], input[type='email'], input[type='date'], textarea");
      var name = (fields[0] && fields[0].value.trim()) || "";
      var email = (fields[1] && fields[1].value.trim()) || "";
      var subject = (fields[2] && fields[2].value.trim()) || "";
      var date = (fields[3] && fields[3].value.trim()) || "";
      var message = (fields[4] && fields[4].value.trim()) || "";

      var lines = [
        "Hello MAS Law Firm, I want to book an appointment.",
        "",
        "Page: " + title,
        "Name: " + name,
        "Email: " + email,
        "Subject: " + subject,
      ];

      if (date) lines.push("Preferred date: " + date);
      if (message) lines.push("Message: " + message);

      var waUrl = "https://wa.me/" + BUSINESS.phoneRaw + "?text=" + encodeURIComponent(lines.join("\n"));

      output.hidden = false;
      output.textContent = "Opening WhatsApp with your appointment request.";
      output.className = "wpcf7-response-output anjum-form-status is-success";

      var popup = window.open(waUrl, "_blank", "noopener");
      if (!popup) window.location.href = waUrl;
    });
  }

  function enhanceForms() {
    initParticlesBackground();
    var title = pickTitle();
    var forms = document.querySelectorAll(".wpcf7-form");

    forms.forEach(function (form) {
      form.setAttribute("action", "#");
      form.classList.add("anjum-static-form");
      addAppointmentMeta(form, title);
      applyFieldEnhancements(form);
      handleSubmit(form, title);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", enhanceForms);
  } else {
    enhanceForms();
  }
})();
