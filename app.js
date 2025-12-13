const liffId = "2007981677-Z8m3omk4";

async function initializeLiff() {
  console.log("[LIFF] initializeLiff start");

  await liff.init({ liffId });
  console.log("[LIFF] init success");

  if (!liff.isLoggedIn()) {
    console.log("[LIFF] not logged in");
    const loginBtn = document.getElementById("loginBtn");
    if (loginBtn) loginBtn.style.display = "block";
    return;
  }

  console.log("[LIFF] logged in");

  const profile = await liff.getProfile();
  console.log("[LIFF] profile", profile);

  // 🔍 เช็คว่าลงทะเบียนหรือยัง
  console.log("[LIFF] checking registration:", profile.userId);
  const result = await checkRegistration(profile.userId);
  console.log("[LIFF] registration result:", result);

  if (!result.registered) {
    console.log("[LIFF] NOT registered → redirect to #register");
    if (location.hash !== "#register") {
      location.hash = "register";
    }
    return;
  }

  console.log("[LIFF] registered → load SPA");

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

  console.log("[API] checkRegistration URL:", url);

  const res = await fetch(url);
  console.log("[API] response status:", res.status);

  const json = await res.json();
  console.log("[API] response json:", json);

  return json;
}

// ใส่ชื่อให้ทุก element  ที่เจอ
function updateUserId(userId) {
  console.log("[UI] updateUserId:", userId);
  const elements = document.querySelectorAll(".userId");
  elements.forEach((el) => (el.textContent = userId));
}

function updateDisplayName(name) {
  console.log("[UI] updateDisplayName:", name);
  const elements = document.querySelectorAll(".displayName");
  elements.forEach((el) => (el.textContent = name));
}

function updatePictureUrl(pictureUrl) {
  console.log("[UI] updatePictureUrl:", pictureUrl);
  const imgs = document.querySelectorAll(".picture");
  imgs.forEach((img) => {
    img.src = pictureUrl;
    img.alt = "Profile Picture";
  });
}

// เลือกรายการเมนูทั้งหมด
const list = document.querySelectorAll(".list");

function activeLink() {
  console.log("[MENU] activeLink clicked");
  list.forEach((item) => item.classList.remove("active"));
  this.classList.add("active");
}

list.forEach((item) => item.addEventListener("click", activeLink));

const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
  loginBtn.addEventListener("click", () => {
    console.log("[LIFF] login button clicked");
    liff.login();
  });
}

// เรียก initialize หลังโหลด index.html
window.onload = () => {
  console.log("[WINDOW] onload");
  initializeLiff();
};

// --- SPA: โหลด fragment แล้วอัปเดตชื่อ ---
async function loadPage(page) {
  console.log("[SPA] loadPage:", page);
  try {
    const res = await fetch(page + ".html");
    console.log("[SPA] fetch page status:", res.status);

    const html = await res.text();
    document.getElementById("app").innerHTML = html;

    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      console.log("[SPA] update profile after load", profile);
      updateUserId(profile.userId);
      updateDisplayName(profile.displayName);
      updatePictureUrl(profile.pictureUrl);
    }
  } catch (err) {
    console.error("[SPA] loadPage error:", err);
    document.getElementById("app").innerHTML = "<p>Error loading page.</p>";
  }
}

function syncActiveMenu(hash) {
  console.log("[MENU] syncActiveMenu:", hash);
  list.forEach((item) => {
    const a = item.querySelector("a");
    item.classList.toggle("active", a.getAttribute("href") === "#" + hash);
  });
}

// กดลิงก์ #xxx
function handleHashChange() {
  const hash = location.hash.replace("#", "") || "home";
  console.log("[ROUTER] handleHashChange:", hash);

  const footer = document.querySelector(".footer-buttons");
  if (footer) {
    footer.style.display = hash === "register" ? "none" : "flex";
  }

  syncActiveMenu(hash);
  loadPage(hash);
}

// เมื่อกดลิงก์ #xxx
window.addEventListener("hashchange", () => {
  console.log("[WINDOW] hashchange:", location.hash);
  handleHashChange();
});
