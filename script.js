// ===== ใส่ API KEY ที่คุณให้มา =====
let API_KEY = "AIzaSyDCujo9QMiUzt9igS00feacfLsBsqgRzT0";
// ====================================

// DOM
const chatBody = document.getElementById("chat-body");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const apiKeyInput = document.getElementById("api-key");
const saveKeyBtn = document.getElementById("save-key-btn");

// แสดง API Key ในช่องใส่
apiKeyInput.value = API_KEY;

// เพิ่มข้อความลงหน้า
function addMessage(sender, text) {
  const div = document.createElement("div");
  div.className = "message " + sender;
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// กำลังคิด...
function showThinking() {
  const t = document.createElement("div");
  t.id = "thinking";
  t.className = "message bot";
  t.textContent = "กำลังคิด...";
  chatBody.appendChild(t);
}

function removeThinking() {
  const t = document.getElementById("thinking");
  if (t) t.remove();
}

// ส่งข้อความ
sendButton.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});

// บันทึกคีย์ใหม่
saveKeyBtn.addEventListener("click", () => {
  const v = apiKeyInput.value.trim();
  if (!v) return alert("ใส่ API Key ก่อน");

  API_KEY = v;
  alert("บันทึกคีย์เรียบร้อย!");
});

// ฟังก์ชันเรียก Gamini API
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;
  if (!API_KEY) return alert("กรุณาใส่ API Key");

  addMessage("user", text);
  userInput.value = "";
  showThinking();

  try {
    const res = await fetch("https://api.gamini.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + API_KEY,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: text }],
      }),
    });

    const data = await res.json();
    removeThinking();

    if (data.choices && data.choices.length > 0) {
      addMessage("bot", data.choices[0].message.content);
    } else {
      addMessage("bot", "API ผิดพลาด หรือ Key ไม่ถูกต้อง");
    }
  } catch (err) {
    removeThinking();
    addMessage("bot", "เชื่อมต่อ API ไม่ได้: " + err.message);
  }
}

// ข้อความต้อนรับ
addMessage("bot", "สวัสดี! ถามอะไรก็ได้เลย 😊");
