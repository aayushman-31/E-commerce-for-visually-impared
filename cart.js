const cartList = document.getElementById('cart-list');
const totalPriceEl = document.getElementById('total-price');
const purchaseBtn = document.getElementById('purchase-btn');

let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

cartItems = cartItems.map(item => {
    if (typeof item === "string") {
        return { name: item, price: Math.floor(Math.random() * 50) + 10 };
    }
    return item;
});
localStorage.setItem('cart', JSON.stringify(cartItems));

function speak(text) {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1;
    msg.lang = 'en-US';
    window.speechSynthesis.speak(msg);
}

function updateTotal() {
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);
    totalPriceEl.textContent = `Total: ${total} rupees`;
    return total;
}

cartItems.forEach((item, index) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-btn';
    removeBtn.textContent = 'Remove';
    removeBtn.addEventListener('mouseenter', () => speak(`Remove ${item.name}`));
    removeBtn.addEventListener('click', () => {
        cartItems.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cartItems));
        location.reload();
    });

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'item-details';

    const itemNameDiv = document.createElement('div');
    itemNameDiv.className = 'item-name';
    itemNameDiv.textContent = item.name;

    const itemPriceDiv = document.createElement('div');
    itemPriceDiv.className = 'item-price';
    itemPriceDiv.textContent = `${item.price} rupees`;

    detailsDiv.appendChild(itemNameDiv);
    detailsDiv.appendChild(itemPriceDiv);

    itemDiv.appendChild(removeBtn);
    itemDiv.appendChild(detailsDiv);

    itemDiv.addEventListener('mouseenter', () => speak(`${item.name}, Price ${item.price} rupees`));

    cartList.appendChild(itemDiv);
});

const total = updateTotal();

purchaseBtn.addEventListener('mouseenter', () => speak("Purchase Now"));

purchaseBtn.addEventListener('click', () => {
    if (cartItems.length === 0) {
        speak("Your cart is empty!");
        return;
    }
    const total = updateTotal();
    speak(`Your total is ${total} rupees. Redirecting to address page`);
    setTimeout(() => {
        window.location.href = "address.html";
    }, 4000);
});

// 🎤 Voice recognition for “purchase now”
window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.lang = 'en-US';
recognition.continuous = true;
recognition.interimResults = false;

recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log("Heard:", transcript);

    if (transcript.includes("purchase now")) {
        if (cartItems.length === 0) {
            speak("Your cart is empty!");
            return;
        }
        const total = updateTotal();
        speak(`Your total is ${total} rupees. Redirecting to address page`);
        setTimeout(() => {
            window.location.href = "address.html";
        }, 4000);
    }
};

recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
};

recognition.onend = () => recognition.start();
recognition.start();
