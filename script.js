const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const apiKeyInput = document.getElementById("api-key");

function addMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click", sendMessage);
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = userInput.value.trim();
  const apiKey = apiKeyInput.value.trim();

  if (!text) return;
  if (!apiKey) return alert("กรุณาใส่ Gamini API Key");

  addMessage("user", text);
  userInput.value = "";

  showThinking();

  callGaminiAPI(text, apiKey);
}

function showThinking() {
  const thinking = document.createElement("div");
  thinking.id = "thinking";
  thinking.classList.add("message", "bot");
  thinking.textContent = "กำลังคิด...";
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function removeThinking() {
  const t = document.getElementById("thinking");
  if (t) t.remove();
}

async function callGaminiAPI(userMessage, apiKey) {
  try {
    const response = await fetch("https://api.gamini.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",   // เลือก model ของ Gamini ได้
        messages: [
          {
            role: "user",
            content: userMessage
          }
        ]
      })
    });

    const data = await response.json();

    removeThinking();

    if (data.choices && data.choices.length > 0) {
      const reply = data.choices[0].message.content;
      addMessage("bot", reply);
    } else {
      addMessage("bot", "บอทตอบไม่ได้ ลองใหม่อีกครั้ง");
    }

  } catch (error) {
    console.error(error);
    removeThinking();
    addMessage("bot", "เกิดข้อผิดพลาดในการเรียก Gamini API");
  }
}
