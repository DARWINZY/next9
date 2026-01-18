// Highlight active nav link based on current file
(() => {
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === path) a.classList.add("active");
  });
})();

// Toast helper
const toastEl = document.getElementById("toast");
let toastTimer = null;
function toast(msg){
  if(!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2000);
}

// Click handlers
document.addEventListener("click", async (e) => {
  // Mobile menu toggle
  const menuBtn = e.target.closest("[data-menu-btn]");
  if(menuBtn){
    const panel = document.getElementById("mobileNav");
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    panel.classList.toggle("open", !expanded);
    return;
  }

  // Close mobile nav when clicking a link inside it
  const navLink = e.target.closest("#mobileNav a");
  if(navLink){
    const panel = document.getElementById("mobileNav");
    const btn2 = document.querySelector("[data-menu-btn]");
    panel.classList.remove("open");
    if(btn2) btn2.setAttribute("aria-expanded", "false");
    return;
  }

  // Copy link
  const copyBtn = e.target.closest("[data-copy-link]");
  if(copyBtn){
    try{
      await navigator.clipboard.writeText(location.href);
      toast("คัดลอกลิงก์แล้ว ✅");
    }catch{
      toast("คัดลอกไม่สำเร็จ");
    }
  }
});
// --- Index popup: show once per session (until browser/tab closed) ---
(() => {
  const path = location.pathname.split("/").pop() || "index.html";
  if (path !== "index.html") return;

  const KEY = "next9_popup_closed";
  const popup = document.getElementById("welcomePopup");
  if (!popup) return;

  if (sessionStorage.getItem(KEY) !== "1") {
    popup.classList.add("show");
    popup.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closePopup(){
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden", "true");
    sessionStorage.setItem(KEY, "1");
    document.body.style.overflow = "";
  }

  popup.addEventListener("click", (e) => {
    if (e.target.closest("[data-popup-close]")) closePopup();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("show")) closePopup();
  });
})();
