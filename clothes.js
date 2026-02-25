const items = document.querySelectorAll('.speakable');
const cartBtn = document.getElementById('cartBtn');

function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1;
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}
items.forEach(item => {
    item.addEventListener('mouseenter', () => speak(item.alt));
    item.addEventListener('click', () => {
        const itemName = item.alt || "this item";
        window.location.href = `yesno.html?item=${encodeURIComponent(itemName)}`;
    });
});

// 🛒 Cart button
cartBtn.addEventListener('mouseenter', () => speak("Go to Cart"));
cartBtn.addEventListener('click', () => {
    window.location.href = 'cart.html';
});

// 🎤 Voice Recognition setup
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

function startListening() {
    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.addEventListener('result', e => {
        const transcript = Array.from(e.results)
            .map(r => r[0])
            .map(r => r.transcript)
            .join('')
            .toLowerCase();
        if (transcript.includes('cart')) {
            speak('Opening your cart');
            setTimeout(() => window.location.href = 'cart.html', 800);
        }
    });

    rec.addEventListener('end', rec.start);
    rec.start();
}
async function initMic() {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        localStorage.setItem("micAllowed", "true");
        document.getElementById('mic-btn').style.display = "none";
        startListening();
    } catch (err) {
        alert("Microphone access denied. Please enable it to use voice commands.");
        console.error(err);
    }
}
window.onload = () => {
    if (!localStorage.getItem("micAllowed")) {
        const micBtn = document.createElement('button');
        micBtn.id = "mic-btn";
        micBtn.textContent = "🎤 Enable Voice Commands";
        micBtn.style.position = "fixed";
        micBtn.style.bottom = "20px";
        micBtn.style.right = "20px";
        micBtn.style.padding = "15px 25px";
        micBtn.style.fontSize = "16px";
        micBtn.style.borderRadius = "10px";
        micBtn.style.background = "#007bff";
        micBtn.style.color = "#fff";
        micBtn.style.border = "none";
        micBtn.style.cursor = "pointer";
        micBtn.onclick = initMic;
        document.body.appendChild(micBtn);
    } else {
        startListening();
    }
};
