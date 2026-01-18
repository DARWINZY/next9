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
// --- Index popup: show every time (refresh / revisit) ---
document.addEventListener("DOMContentLoaded", () => {
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

  popup.addEventListener("click", (e) => {
    if (e.target.closest("[data-popup-close]")) closePopup();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && popup.classList.contains("show")) closePopup();
  });
});
// ===== Candidates page: render cards + fullscreen profile modal =====
document.addEventListener("DOMContentLoaded", () => {
  const path = location.pathname.split("/").pop() || "index.html";
  if (path !== "candidates.html") return;

  const data = window.CANDIDATES || [];
  const grid = document.getElementById("candidateGrid");
  const modal = document.getElementById("profileModal");
  const content = document.getElementById("profileContent");

  if (!grid || !modal || !content) return;

  // Render candidate cards
  grid.innerHTML = data.map(c => `
    <div class="candidate-card" role="button" tabindex="0" data-open-candidate="${c.id}">
      <span class="tag red candidate-role">${escapeHtml(c.role)}</span>
      <div class="candidate-badge">${escapeHtml(c.number || "")}</div>

      <img class="candidate-photo" src="${escapeAttr(c.photo)}" alt="${escapeAttr(c.firstName)} ${escapeAttr(c.lastName)}">

      <div class="nameplate">
        <div class="name-first">${escapeHtml(c.firstName)}</div>
        <div class="name-last">${escapeHtml(c.lastName)}</div>
      </div>
    </div>
  `).join("");

  function openProfile(id){
    const c = data.find(x => x.id === id);
    if (!c) return;

    content.innerHTML = `
      <!-- การ์ดรูปแบบเดียวกับ candidate card -->
      <div class="candidate-card" style="max-width:520px;margin:8px auto 0;">
        <span class="tag red candidate-role">${escapeHtml(c.role)}</span>
        <div class="candidate-badge">${escapeHtml(c.number || "")}</div>
        <img class="candidate-photo" src="${escapeAttr(c.photo)}" alt="${escapeAttr(c.firstName)} ${escapeAttr(c.lastName)}">
        <div class="nameplate">
          <div class="name-first">${escapeHtml(c.firstName)}</div>
          <div class="name-last">${escapeHtml(c.lastName)}</div>
        </div>
      </div>

      <!-- เลื่อนลงมาเจอชื่ออีกครั้ง -->
      <div style="max-width:520px;margin:0 auto;">
        <div class="profile-name-big">${escapeHtml(c.firstName)} ${escapeHtml(c.lastName)}</div>
        <div class="profile-name-sub">${escapeHtml(c.role)} • เบอร์ ${escapeHtml(c.number || "-")}</div>
      </div>

      <!-- ผลงาน -->
      <div class="profile-section">
        <div class="pad">
          <h3>${escapeHtml(c.achievementsTitle || "ผลงานที่เคยทำมา")}</h3>
          <ul>
            ${(c.achievements || []).map(x => `<li>${escapeHtml(x)}</li>`).join("") || "<li>ยังไม่มีข้อมูล</li>"}
          </ul>
        </div>
      </div>

      <!-- ประวัติการศึกษา -->
      <div class="profile-section">
        <div class="pad">
          <h3>ประวัติการศึกษา</h3>
          <ul>
            ${(c.education || []).map(x => `<li>${escapeHtml(x)}</li>`).join("") || "<li>ยังไม่มีข้อมูล</li>"}
          </ul>
        </div>
      </div>
    `;

    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeProfile(){
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Click to open
  grid.addEventListener("click", (e) => {
    const el = e.target.closest("[data-open-candidate]");
    if (!el) return;
    openProfile(el.getAttribute("data-open-candidate"));
  });

  // Keyboard open (Enter/Space)
  grid.addEventListener("keydown", (e) => {
    const el = e.target.closest("[data-open-candidate]");
    if (!el) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openProfile(el.getAttribute("data-open-candidate"));
    }
  });

  // Close handlers
  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-profile-close]")) closeProfile();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) closeProfile();
  });

  // Helpers to prevent HTML injection
  function escapeHtml(s){
    return String(s ?? "")
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }
  function escapeAttr(s){ return escapeHtml(s); }
});
