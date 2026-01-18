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
// --- Index popup: show every time (refresh / re-open / revisit) ---
(() => {
  const path = location.pathname.split("/").pop() || "index.html";
  if (path !== "index.html") return;

  const popup = document.getElementById("welcomePopup");
  if (!popup) return;

  // show every time
  popup.classList.add("show");
  popup.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  function closePopup(){
    popup.classList.remove("show");
    popup.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // close when clicking X or backdrop
  popup.addEventListener("click", (e) => {
    if (e.target.closest("[data-popup-close]")) closePopup();
  });

  // close with ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("show")) closePopup();
  });
})();
