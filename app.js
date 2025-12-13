const liffId = "2007981677-Z8m3omk4";

async function initializeLiff() {
  await liff.init({ liffId });

  // 🔐 AUTO LOGIN
  if (!liff.isLoggedIn()) {
    liff.login();
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

function checkRegistration(userId) {
  return new Promise((resolve) => {
    const cb = "cb_" + Date.now();

    window[cb] = (data) => {
      resolve(data);
      delete window[cb];
    };

    const script = document.createElement("script");
    script.src =
      "https://script.google.com/macros/s/AKfycby3J0wym16w76Y1UpgjzIErZiDKdpqQFsgNtwCYDi81Lp6H-rDpIxgAOZqMIDL__H5KHw/exec" +
      "?action=checkUser" +
      "&userId=" + encodeURIComponent(userId) +
      "&callback=" + cb;

    document.body.appendChild(script);
  });
}


// ใส่ชื่อให้ทุก element  ที่เจอ
function updateUserId(userId) {
  document.querySelectorAll(".userId")
    .forEach((el) => (el.textContent = userId));
}

function updateDisplayName(name) {
  document.querySelectorAll(".displayName")
    .forEach((el) => (el.textContent = name));
}

function updatePictureUrl(pictureUrl) {
  document.querySelectorAll(".picture")
    .forEach((img) => {
      img.src = pictureUrl;
      img.alt = "Profile Picture";
    });
}

// เมนู
const list = document.querySelectorAll(".list");

function activeLink() {
  list.forEach((item) => item.classList.remove("active"));
  this.classList.add("active");
}
list.forEach((item) => item.addEventListener("click", activeLink));

// เรียก initialize หลังโหลด
window.onload = () => {
  initializeLiff();
};

// --- SPA ---
async function loadPage(page) {
  try {
    const res = await fetch(page + ".html");
    const html = await res.text();
    document.getElementById("app").innerHTML = html;

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

function handleHashChange() {
  const hash = location.hash.replace("#", "") || "home";

  const footer = document.querySelector(".footer-buttons");
  if (footer) {
    footer.style.display = hash === "register" ? "none" : "flex";
  }

  syncActiveMenu(hash);
  loadPage(hash);
}

window.addEventListener("hashchange", handleHashChange);
