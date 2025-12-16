// โค้ดนี้รันบน Netlify Server (Private)

// ใช้ URL ลับเดียวกับ checkUser
const APPS_SCRIPT_BASE_URL = process.env.GAS_API_URL;

exports.handler = async (event, context) => {

  // รองรับ preflight (เผื่ออนาคต)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: "",
    };
  }

  // บังคับให้เป็น POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    // 1. รับข้อมูลจาก Frontend
    const body = JSON.parse(event.body);

    const {
      line_uid,
      line_name,
      profile_image,
      name,
      phone,
      email,
      address
    } = body;

    // 2. validate ขั้นต่ำ
    if (!line_uid || !name || !phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing required fields",
        }),
      };
    }

    // 3. เตรียม payload ส่งให้ GAS
    const payload = {
      action: "registerUser",
      data: {
        line_uid,
        line_name,
        profile_image,
        name,
        phone,
        email,
        address,
      },
    };

    // 4. เรียก GAS (Server-to-Server)
    const response = await fetch(APPS_SCRIPT_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    // 5. ส่งผลลัพธ์กลับไปให้ Frontend
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result),
    };

  } catch (error) {
    console.error("[registerUser] error:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
    };
  }
};
