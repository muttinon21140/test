// api.js

function checkRegistration(userId) {
  console.log("[PROXY] prepare request", userId);

  // *** ลบโค้ด JSONP เดิมที่สร้าง <script> และเปิดเผย Apps Script URL ออกไป ***

  // ใช้ fetch API เพื่อเรียก Proxy แทน
  return fetch(`${NETLIFY_CHECKUSER_URL}?userId=${encodeURIComponent(userId)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json(); // อ่านผลลัพธ์ที่เป็น JSON สะอาด
    })
    .then((data) => {
      console.log("[PROXY] response", data);
      return data;
    })
    .catch((error) => {
      console.error("[PROXY] Error fetching registration:", error);
      return { registered: false };
    });
}
