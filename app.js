const liffId = "2007981677-Z8m3omk4";

async function initializeLiff() {
  await liff.init({ liffId });

  if (!liff.isLoggedIn()) {
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) loginBtn.style.display = "block";
    return;
  }

  const profile = await liff.getProfile();

  // 🔍 เช็คว่าลงทะเบียนหรือยัง
  const result = await checkRegistration(profile.userId);

  if (!result.registered) {
    // ❌ ยังไม่ลงทะเบียน → ไปหน้า register
    if (location.hash !== "#register") {
      location.hash = "register";
    }
    return;
  }

  // --- ถ้า Login แล้ว โหลดหน้า SPA ---
  handleHashChange();

  // ดึงโปรไฟล์
  updateUserId(profile.userId);
  updateDisplayName(profile.displayName);
  updatePictureUrl(profile.pictureUrl);
}

async function checkRegistration(userId) {
  const url =
    "https://script.google.com/macros/s/AKfycbw7jfP2LnNAIht5kJPhlgwS3IqqBZTbunHWqWenuq0TrHIwHNnAzu5v7O9aAXi5jKqfZA/exec" +
    "?action=checkUser" +
    "&userId=" +
    encodeURIComponent(userId);

  const res = await fetch(url);
  return await res.json();
}

// ใส่ชื่อให้ทุก element  ที่เจอ
function updateUserId(userId) {
  const elements = document.querySelectorAll(".userId"); // เปลี่ยนจาก #userId เป็น class
  elements.forEach((el) => (el.textContent = userId));
}

function updateDisplayName(name) {
  const elements = document.querySelectorAll(".displayName"); // ใช้ class แทน id
  elements.forEach((el) => (el.textContent = name));
}

function updatePictureUrl(pictureUrl) {
  const imgs = document.querySelectorAll(".picture"); // ใช้ class และ <img>
  imgs.forEach((img) => {
    img.src = pictureUrl;
    img.alt = "Profile Picture"; // เผื่อรูปไม่โหลด
  });
}
// เลือกรายการเมนูทั้งหมด (li ทั้งหมดที่มี class="list")
const list = document.querySelectorAll(".list");

function activeLink() {
  // 1. ลบคลาส active ออกจากทุกตัวก่อน
  list.forEach((item) => item.classList.remove("active"));
  // 2. เติมคลาส active ให้กับตัวที่ถูกคลิก (this)
  this.classList.add("active");
}

// วนลูปเพิ่ม Event Listener ให้ทุกเมนู
list.forEach((item) => item.addEventListener("click", activeLink));
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
      updateUserId(profile.userId);
      updateDisplayName(profile.displayName);
      updatePictureUrl(profile.pictureUrl);
    }
  } catch (err) {
    document.getElementById("app").innerHTML = "<p>Error loading page.</p>";
  }
}

function syncActiveMenu(hash) {
  list.forEach((item) => {
    const a = item.querySelector("a");
    item.classList.toggle("active", a.getAttribute("href") === "#" + hash);
  });
}

// กดลิงก์ #xxx
function handleHashChange() {
  const hash = location.hash.replace("#", "") || "home";

  const footer = document.querySelector(".footer-buttons");
  if (footer) {
    footer.style.display = hash === "register" ? "none" : "flex";
  }
  syncActiveMenu(hash);
  loadPage(hash);
}

// เมื่อกดลิงก์ #xxx
window.addEventListener("hashchange", handleHashChange);
