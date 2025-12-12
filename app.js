const liffId = "2007981677-Z8m3omk4";

async function initializeLiff() {
  await liff.init({ liffId });

  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile();

    // ใส่ชื่อให้ทุก element #displayName ที่เจอ
    const displayElements = document.querySelectorAll("#displayName");
    displayElements.forEach(el => el.textContent = profile.displayName);

  } else {
    const loginBtn = document.getElementById("loginBtn");
    if(loginBtn) loginBtn.style.display = "block";
  }
}

const loginBtn = document.getElementById("loginBtn");
if(loginBtn) {
  loginBtn.addEventListener("click", () => liff.login());
}

// เรียก initialize หลังโหลดหน้าเว็บ
window.onload = () => {
  initializeLiff();
};
