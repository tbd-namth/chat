const API_KEY = "AIzaSyDCujo9QMiUzt9igS00feacfLsBsqgRzT0";

async function sendMessage() {
    const input = document.getElementById("msgInput");
    const text = input.value.trim();
    if (!text) return;

    addMessage("user", text);
    input.value = "";

    addMessage("bot", "กำลังคิด...");

    const reply = await getGaminiReply(text);

    removeThinking();
    addMessage("bot", reply);
}

function addMessage(sender, text) {
    const box = document.getElementById("messages");
    const div = document.createElement("div");
    div.className = "message " + sender;
    div.innerText = text;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
}

function removeThinking() {
    const msgs = document.querySelectorAll(".bot");
    const last = msgs[msgs.length - 1];
    if (last && last.innerText === "กำลังคิด...") last.remove();
}

async function getGaminiReply(userMessage) {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

    const body = {
        contents: [
            {
                parts: [{ text: userMessage }]
            }
        ]
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || "ขออภัย ตอบไม่ได้";
    } catch (e) {
        return "เกิดข้อผิดพลาด";
    }
}
