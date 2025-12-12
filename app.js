// 1. กำหนด LIFF ID (ได้จาก LINE Developers Console)
const liffId = "2007981677-Z8m3omk4";

// 2. เริ่มต้น LIFF
async function initializeLiff() {
  await liff.init({ liffId });
  console.log("LIFF Initialized");

  if (liff.isLoggedIn()) {
    console.log("User is logged in");
    const profile = await liff.getProfile();
    console.log(profile.displayName, profile.userId);
  } else {
    console.log("User not logged in");
    document.getElementById("loginBtn").style.display = "block";
  }
}

// 3. ฟังก์ชัน login/logout
document.getElementById("loginBtn").addEventListener("click", () => {
  liff.login();
});

document.getElementById("sendBtn").addEventListener("click", async () => {
  if (liff.isLoggedIn()) {
    await liff.sendMessages([
      {
        type: "text",
        text: "Hello from LIFF!"
      }
    ]);
    alert("Message sent!");
  } else {
    alert("Please login first.");
  }
});

// 4. เรียก initialize ตอนโหลดเว็บ
initializeLiff();

async function sendToGAS(userId, message) {
  const url = "https://script.google.com/macros/s/AKfycbyUSOd0LyDVnm2fz-Hircb8R8aawArFMz34cz9-pozzzv0BVgyNN0JookZruzpOnFzGMQ/exec";
  // URL ของ GAS Web App

  const payload = {
    userId: userId,
    message: message
  };

  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });

  const result = await response.json();
  console.log(result);
}

// ตัวอย่างเรียก
document.getElementById("sendBtn").addEventListener("click", async () => {
  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile();
    await sendToGAS(profile.userId, "Hello from LIFF!");
    alert("Data sent to GAS!");
  } else {
    alert("Please login first.");
  }
});

