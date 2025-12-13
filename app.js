const liffId = "2007981677-Z8m3omk4";
let isRegistered = false;

async function initializeLiff() {
  console.log("[LIFF] initialize start");

  await liff.init({ liffId });
  console.log("[LIFF] init done");

  // 🔐 AUTO LOGIN
  if (!liff.isLoggedIn()) {
    console.log("[LIFF] not logged in → redirect to login");
    liff.login();
    return;
  }

  console.log("[LIFF] logged in");

  const profile = await liff.getProfile();
  console.log("[LIFF] profile", profile);

  // 🔍 เช็คว่าลงทะเบียนหรือยัง
  console.log("[CHECK] checking registration for", profile.userId);
  const result = await checkRegistration(profile.userId);
  isRegistered = result.registered;
  console.log("[CHECK] result", result);

  if (!result.registered) {
    console.log("[CHECK] user NOT registered → go register");
    const footer = document.querySelector(".footer-buttons");
    if (footer) footer.style.display = "none";
    if (location.hash !== "#register") {
      location.hash = "register";
    }
    return;
  }

  console.log("[CHECK] user registered");

  const footer = document.querySelector(".footer-buttons");
  if (footer) footer.style.display = "flex";

  // ✅ ใช้แบบนี้แทน
  if (!location.hash) {
    location.hash = "home";
  }

  // ดึงโปรไฟล์
  updateUserId(profile.userId);
  updateDisplayName(profile.displayName);
  updatePictureUrl(profile.pictureUrl);
}

function checkRegistration(userId) {
  console.log("[JSONP] prepare request", userId);

  return new Promise((resolve) => {
    const cb = "cb_" + Date.now();
    console.log("[JSONP] callback =", cb);
    const script = document.createElement("script");

    window[cb] = (data) => {
      console.log("[JSONP] response", data);
      resolve(data);
      delete window[cb];
      script.remove(); // ✅ เพิ่มบรรทัดนี้
    };

    script.src =
      "https://script.google.com/macros/s/AKfycbx29C1E_Gz-TI8axMoJSHgWHj2LLEcW90xzcq6IYKnTlWQ2k2e6oQ78CTUgW2jltoDQhA/exec" +
      "?action=checkUser" +
      "&userId=" + encodeURIComponent(userId) +
      "&callback=" + cb;

    console.log("[JSONP] request url", script.src);
    document.body.appendChild(script);
  });
}

// ใส่ชื่อให้ทุก element  ที่เจอ
function updateUserId(userId) {
  console.log("[UI] updateUserId", userId);
  document.querySelectorAll(".userId")
    .forEach((el) => (el.textContent = userId));
}

function updateDisplayName(name) {
  console.log("[UI] updateDisplayName", name);
  document.querySelectorAll(".displayName")
    .forEach((el) => (el.textContent = name));
}

function updatePictureUrl(pictureUrl) {
  console.log("[UI] updatePictureUrl", pictureUrl);
  document.querySelectorAll(".picture")
    .forEach((img) => {
      img.src = pictureUrl;
      img.alt = "Profile Picture";
    });
}

// เมนู
const list = document.querySelectorAll(".list");

function activeLink() {
  console.log("[MENU] active", this);
  list.forEach((item) => item.classList.remove("active"));
  this.classList.add("active");
}
list.forEach((item) => item.addEventListener("click", activeLink));

// เรียก initialize หลังโหลด
window.onload = () => {
  console.log("[APP] window loaded");
  initializeLiff();
};

// --- SPA ---
async function loadPage(page) {
  console.log("[SPA] load page", page);

  try {
    const res = await fetch(page + ".html");
    const html = await res.text();
    document.getElementById("app").innerHTML = html;

    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      console.log("[SPA] refresh profile after load", profile.userId);
      updateUserId(profile.userId);
      updateDisplayName(profile.displayName);
      updatePictureUrl(profile.pictureUrl);
    }
  } catch (err) {
    console.error("[SPA] load error", err);
    document.getElementById("app").innerHTML = "<p>Error loading page.</p>";
  }
}

function syncActiveMenu(hash) {
  console.log("[MENU] sync active", hash);
  list.forEach((item) => {
    const a = item.querySelector("a");
    item.classList.toggle("active", a.getAttribute("href") === "#" + hash);
  });
}

function handleHashChange() {
  const hash = location.hash.replace("#", "") || "home";
  console.log("[ROUTER] hash change →", hash);

  // ❌ ยังไม่ลงทะเบียน แต่พยายามเข้าหน้าอื่น
  if (!isRegistered && hash !== "register") {
    console.warn("[ROUTER] blocked → force register");
    location.hash = "register";
    return;
  }

  const footer = document.querySelector(".footer-buttons");
  if (footer) {
    footer.style.display = hash === "register" ? "none" : "flex";
  }

  syncActiveMenu(hash);
  loadPage(hash);
}


window.addEventListener("hashchange", handleHashChange);