// 1. ฟังก์ชันสำหรับ LIFF
const liffId = "2007981677-Z8m3omk4";

async function initializeLiff() {
  await liff.init({ liffId });

  if (liff.isLoggedIn()) {
    const profile = await liff.getProfile();
    document.getElementById("displayName").textContent = profile.displayName;
  } else {
    document.getElementById("loginBtn").style.display = "block";
  }
}

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

initializeLiff();




// 2. ฟังก์ชันส่งข้อมูลไปยัง Google Apps Script
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

