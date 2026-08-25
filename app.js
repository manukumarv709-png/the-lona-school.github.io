const navToggle = document.getElementById("navToggle");
const navPanel = document.getElementById("primaryNav");
const toastMessage = document.getElementById("toastMessage");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const subjectInput = document.getElementById("subject");

let toastTimer;

function showToast(message) {
  if (!toastMessage) return;
  toastMessage.textContent = message;
  toastMessage.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastMessage.classList.remove("show");
  }, 3200);
}

function closeMobileNav() {
  if (!navPanel || !navToggle) return;
  navPanel.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

if (navToggle && navPanel) {
  navToggle.addEventListener("click", () => {
    const isOpen = navPanel.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  });
}

document.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const navLink = target.closest(".nav-panel a");
  if (navLink) {
    closeMobileNav();
  }

  const subjectLink = target.closest("[data-subject]");
  if (subjectLink && subjectInput) {
    subjectInput.value = subjectLink.getAttribute("data-subject") || "";
  }

  const demoAction = target.closest("[data-demo-action]");
  if (demoAction) {
    event.preventDefault();
    const label = demoAction.getAttribute("data-demo-action") || "This area";
    showToast(`${label} is a demo placeholder ready for the school's real content.`);
  }

  if (navPanel && navToggle && !target.closest(".nav-shell")) {
    closeMobileNav();
  }
});

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("visitorName") || "Thank you").trim() || "Thank you";
    formStatus.textContent = `${name}, your demo message has been prepared. Connect this form to the school's approved contact route before launch.`;
    showToast("Demo message prepared.");
    contactForm.reset();
  });
}

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav-panel a[href^='#']")];

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
    });
  }, {
    rootMargin: "-32% 0px -58% 0px",
    threshold: [0.1, 0.2, 0.4]
  });

  sections.forEach(section => sectionObserver.observe(section));
}

window.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeMobileNav();
  }
});
