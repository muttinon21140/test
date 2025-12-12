const liffId = "2007981677-Z8m3omk4";

// ฟังก์ชัน initialize LIFF
async function initializeLiff() {
  await liff.init({ liffId });

  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile();
    document.getElementById("displayName").textContent = profile.displayName;
  } else {
    document.getElementById("loginBtn").style.display = "block";
  }
}

// ปุ่ม Login
document.getElementById("loginBtn").addEventListener("click", () => {
  liff.login();
});

// เรียก initialize หลังโหลดหน้าเว็บ
window.onload = () => {
  initializeLiff();
};