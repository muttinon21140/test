const liffId = "2007981677-Z8m3omk4";

async function initializeLiff() {
  await liff.init({ liffId });

  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile();
    updateDisplayName(profile.displayName);
  } else {
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) loginBtn.style.display = "block";
  }
}

function updateDisplayName(name) {
  // ใส่ชื่อให้ทุก element #displayName ที่เจอ
  const displayElements = document.querySelectorAll("#displayName");
  displayElements.forEach(el => el.textContent = name);
}

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => liff.login());
}

// เรียก initialize หลังโหลด index.html
window.onload = () => {
  initializeLiff();
};

// --- SPA: โหลด fragment แล้วอัปเดตชื่อ ---
async function loadPage(page) {
  try {
    const res = await fetch(page + ".html");
    const html = await res.text();
    document.getElementById("app").innerHTML = html;

    // หลังโหลด fragment ให้ลองใส่ชื่ออีกครั้ง
    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      updateDisplayName(profile.displayName);
    }
  } catch (err) {
    document.getElementById("app").innerHTML =
      "<p>Error loading page.</p>";
  }
}

// กดลิงก์ #xxx
function handleHashChange() {
  const hash = location.hash.replace("#", "") || "home";
  loadPage(hash);
}

window.addEventListener("hashchange", handleHashChange);
handleHashChange(); // โหลดหน้าแรก
