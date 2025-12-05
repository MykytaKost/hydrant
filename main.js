// Alert po kliknięciu na hydrant
document.getElementById("hydrant").addEventListener("click", function(event) {
alert("GRATULACJĘ UŻYTKOWNIKU");
})

let attempts = 0;
let textCaptchaCode = '';

// IMAGE CAPTCHA
// Dodaje reakcję na kliknięcie dla KAŻDEGO obrazka w siatce
document.querySelectorAll('.image-grid img').forEach(img => {
    img.addEventListener('click', function() {
        // Zaznacza lub odznacza obrazek (dodaje/usuwa klasę .selected)
        this.classList.toggle('selected');
    });
});

// Funkcja sprawdzająca poprawność CAPTCHA
function verifyCaptcha() {
    const messageEl = document.getElementById('message');
    const images = document.querySelectorAll('.image-grid img');
    
    attempts++; // Licznik prób

    // Pobiera wszystkie obrazki, które użytkownik zaznaczył
    const selectedImages = document.querySelectorAll('.image-grid img.selected');

    // Użytkownik nie zaznaczył nic → błąd
    if (selectedImages.length === 0) {
        messageEl.className = 'message error';
        messageEl.textContent = 'Wybierz przynajmniej jeden obraz lub kliknij "pomiń"';
        messageEl.style.display = 'block';
        return;
    }

    let allCorrect = true; // Flaga sprawdzająca poprawność wszystkiego
    
    // Sprawdzamy każdy obraz
    images.forEach(img => {
        const isCorrect = img.dataset.correct === 'true';  // Czy obraz ma być zaznaczony
        const isSelected = img.classList.contains('selected'); // Czy użytkownik go zaznaczył
        
        // Jeśli poprawność nie zgadza się z wyborem użytkownika → błąd
        if (isCorrect !== isSelected) {
            allCorrect = false;
        }
    });

    // Jeśli użytkownik zaznaczył wszystko poprawnie
    if (allCorrect) {
        messageEl.className = 'message success';
        messageEl.textContent = '✓ Weryfikacja udana!';
        messageEl.style.display = 'block';
        
        // Po małej chwili czyścimy CAPTCHA
        setTimeout(() => {
            images.forEach(img => img.classList.remove('selected')); // Usuwamy zaznaczenie
            messageEl.style.display = 'none'; // Ukrywamy komunikat
            attempts = 0; // Reset liczby prób
        }, 800);
    } 
    else {
        // Jeżeli użytkownik popełnił błąd
        messageEl.className = 'message error';
        messageEl.textContent = 'Spróbuj ponownie. Wybierz wszystkie obrazy z drogami.';
        messageEl.style.display = 'block';
        
        // Resetujemy zaznaczenia
        setTimeout(() => {
            images.forEach(img => img.classList.remove('selected'));
            messageEl.style.display = 'none';
        }, 800);
    }
}

// Funkcja "pomiń" — czyści zaznaczenia i komunikaty
function skipCaptcha() {
    const images = document.querySelectorAll('.image-grid img');
    images.forEach(img => img.classList.remove('selected'));
    document.getElementById('message').style.display = 'none';
}

// TEXT CAPTCHA
function generateRandomCode(length = 6) {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

function generateTextCaptcha() {
    textCaptchaCode = generateRandomCode();
    const canvas = document.getElementById('captchaCanvas');
    const ctx = canvas.getContext('2d');
    const input = document.getElementById('captchaInput');
    const verifyBtn = document.querySelector('.text-captcha').nextElementSibling.querySelector('.verify-btn');
    
    // Odblokowanie pola input i przycisku
    input.disabled = false;
    if (verifyBtn) {
        verifyBtn.disabled = false;
    }
    
    // czyszczenia canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background noise
    ctx.fillStyle = '#f9f9f9';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // interference lines
    for (let i = 0; i < 12; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150}, ${0.4 + Math.random() * 0.3})`;
        ctx.lineWidth = 1 + Math.random() * 2;
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.bezierCurveTo(
            Math.random() * canvas.width, Math.random() * canvas.height,
            Math.random() * canvas.width, Math.random() * canvas.height,
            Math.random() * canvas.width, Math.random() * canvas.height
        );
        ctx.stroke();
    }
    
    // Faliste linie
    for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 100}, ${Math.random() * 100}, ${Math.random() * 100}, 0.5)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < canvas.width; x += 5) {
            const y = canvas.height / 2 + Math.sin(x / 20 + i) * 15;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    // Text
    ctx.font = 'bold 42px Arial';
    ctx.textBaseline = 'middle';
    
    for (let i = 0; i < textCaptchaCode.length; i++) {
        const char = textCaptchaCode[i];
        const x = 20 + i * 45;
        const y = 40;
        
        // przypadkowy obrót
        const angle = (Math.random() - 0.5) * 0.8;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        
        // random color z zestawu
        const colors = ['#1a73e8', '#d93025', '#f9ab00', '#1e8e3e', '#9334e6', '#ea4335', '#fbbc04'];
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        
        // silne przypadkowe przesunięcie
        const yOffset = (Math.random() - 0.5) * 20;
        const xOffset = (Math.random() - 0.5) * 10;
        
        // Dodawanie cienia dla zniekształcenia
        ctx.shadowColor = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
        ctx.shadowBlur = 2 + Math.random() * 3;
        ctx.shadowOffsetX = (Math.random() - 0.5) * 4;
        ctx.shadowOffsetY = (Math.random() - 0.5) * 4;
        
        // Przypadkowe rozciągnięcie
        ctx.scale(0.9 + Math.random() * 0.3, 0.9 + Math.random() * 0.3);
        
        ctx.fillText(char, xOffset, yOffset);
        
        ctx.restore();
    }
    
    // Więcej punktów zakłóceń
    for (let i = 0; i < 150; i++) {
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 0.5})`;
        const size = Math.random() * 3;
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, size, size);
    }
    
    // Dodawanie nakładających się owali
    for (let i = 0; i < 8; i++) {
        ctx.strokeStyle = `rgba(${Math.random() * 200}, ${Math.random() * 200}, ${Math.random() * 200}, 0.2)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            10 + Math.random() * 30,
            10 + Math.random() * 30,
            Math.random() * Math.PI,
            0,
            Math.PI * 2
        );
        ctx.stroke();
    }
    
    document.getElementById('captchaInput').value = '';
    document.getElementById('textMessage').style.display = 'none';
}

function verifyTextCaptcha() {
    const input = document.getElementById('captchaInput');
    const inputValue = input.value.toUpperCase();
    const messageEl = document.getElementById('textMessage');
    const verifyBtn = document.querySelector('.text-captcha').nextElementSibling.querySelector('.verify-btn');
    
    if (inputValue === '') {
        messageEl.className = 'message error';
        messageEl.textContent = 'Proszę wpisać tekst z obrazu';
        messageEl.style.display = 'block';
        return;
    }
    
    if (inputValue === textCaptchaCode) {
        messageEl.className = 'message success';
        messageEl.textContent = '✓ Kod prawidłowy! Weryfikacja zakończona.';
        messageEl.style.display = 'block';
        
        // Blokowanie pola input
        input.disabled = true;
        
        // Opcjonalnie: blokowanie przycisku Sprawdź
        if (verifyBtn) {
            verifyBtn.disabled = true;
        }
    } else {
        messageEl.className = 'message error';
        messageEl.textContent = 'Nieprawidłowy kod. Spróbuj ponownie.';
        messageEl.style.display = 'block';
        
        setTimeout(() => {
            generateTextCaptcha();
        }, 1500);
    }
}

// Enter w celu sprawdzenia
document.getElementById('captchaInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verifyTextCaptcha();
    }
});

// Generowanie pierwszego tekstowego CAPTCHA
generateTextCaptcha();