// Active nav ตามหน้า
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
  toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

// Copy link
document.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-copy-link]");
  if(btn){
    try{
      await navigator.clipboard.writeText(location.href);
      toast("คัดลอกลิงก์แล้ว ✅");
    }catch{
      toast("คัดลอกไม่สำเร็จ ลองคัดลอกเองจากแถบ URL");
    }
    return;
  }

  // Mobile menu toggle
  const menuBtn = e.target.closest("[data-menu-btn]");
  if(menuBtn){
    const panel = document.getElementById("mobileNav");
    const expanded = menuBtn.getAttribute("aria-expanded") === "true";
    menuBtn.setAttribute("aria-expanded", String(!expanded));
    panel.classList.toggle("open", !expanded);
    return;
  }

  // ปิดเมนูเมื่อกดลิงก์ในเมนูมือถือ
  const navLink = e.target.closest("#mobileNav a");
  if(navLink){
    const panel = document.getElementById("mobileNav");
    const btn2 = document.querySelector("[data-menu-btn]");
    panel.classList.remove("open");
    if(btn2) btn2.setAttribute("aria-expanded", "false");
  }
});
