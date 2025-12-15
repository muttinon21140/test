// โค้ดนี้จะรันบน Netlify Server และเป็นส่วน 'Private' ของคุณ

// ดึง URL ความลับจาก Environment Variable ที่ตั้งไว้ใน Netlify Admin
const APPS_SCRIPT_BASE_URL = process.env.GAS_CHECK_USER_URL; 

exports.handler = async (event, context) => {
  // 1. รับพารามิเตอร์ userId จาก Frontend
  const userId = event.queryStringParameters.userId;
  
  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing userId' }),
    };
  }
  
  // 2. สร้าง URL สำหรับเรียก Apps Script จริงๆ โดยใช้ความลับที่ซ่อนไว้
  const fullAppsScriptUrl = 
    `${APPS_SCRIPT_BASE_URL}?action=checkUser&userId=${encodeURIComponent(userId)}&callback=jsonpCallback`;
    
  try {
    // 3. เรียก Apps Script โดยตรงจาก Server (Server-to-Server)
    const response = await fetch(fullAppsScriptUrl);
    
    // 4. เนื่องจาก Apps Script เดิมใช้ JSONP (มีการครอบฟังก์ชัน) เราต้องแก้ไขผลลัพธ์
    const text = await response.text();
    const jsonpData = text.match(/jsonpCallback\((.*)\)/);

    let result = { registered: false, error: 'Invalid response format' };
    if (jsonpData && jsonpData[1]) {
        result = JSON.parse(jsonpData[1]);
    }

    // 5. ส่งผลลัพธ์ที่เป็น JSON สะอาดกลับไปให้ Frontend
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error("Apps Script call failed:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ registered: false, error: 'Internal server error' }),
    };
  }
};
