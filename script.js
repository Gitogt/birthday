// =====================================================
// GOOGLE APPS SCRIPT
// =====================================================

const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycby3_3uVt_TBm0X5Kddc7x5xJ300CYnSv3N7p8jUwt_7Vw7Ar2pwvazpS6nw07qULK58/exec";


// =====================================================
// PAGES
// =====================================================

const pages = document.querySelectorAll(".page");

function showPage(pageNumber) {

    pages.forEach((page) => {
        page.classList.remove("active");
    });

    const targetPage =
        document.getElementById(`page${pageNumber}`);

    if (targetPage) {

        targetPage.classList.add("active");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
}


// =====================================================
// PAGE 1
// HAPE LETREN
// =====================================================

const startBtn =
    document.getElementById("startBtn");

startBtn.addEventListener("click", () => {

    showPage(2);

});


// =====================================================
// PAGE 2
// QIRINJTE
// =====================================================

const blowBtn =
    document.getElementById("blowBtn");

const continueBtn =
    document.getElementById("continueBtn");

const candles =
    document.querySelectorAll(".candle");


blowBtn.addEventListener("click", () => {

    candles.forEach((candle, index) => {

        setTimeout(() => {

            candle.classList.add("blown");

        }, index * 150);

    });

    blowBtn.disabled = true;

    blowBtn.textContent =
        "Deshira u be ♡";


    setTimeout(() => {

        continueBtn.classList.remove("hidden");

    }, 1200);

});


// =====================================================
// PAGE 2 → PAGE 3
// =====================================================

continueBtn.addEventListener("click", () => {

    showPage(3);

});


// =====================================================
// PAGE 3 → PAGE 4
// =====================================================

const finishLetterBtn =
    document.getElementById("finishLetterBtn");

finishLetterBtn.addEventListener("click", () => {

    showPage(4);

});


// =====================================================
// MESSAGE COUNTER
// =====================================================

const messageInput =
    document.getElementById("messageInput");

const counter =
    document.getElementById("counter");


messageInput.addEventListener("input", () => {

    const length =
        messageInput.value.length;

    counter.textContent =
        `${length} / 1500`;

});


// =====================================================
// SEND MESSAGE
// =====================================================

const sendBtn =
    document.getElementById("sendBtn");


sendBtn.addEventListener("click", async () => {

    const message =
        messageInput.value.trim();


    // Mos lejo mesazh bosh

    if (!message) {

        messageInput.focus();

        return;

    }


    // Butoni ne gjendje loading

    sendBtn.disabled = true;

    sendBtn.innerHTML =
        "Po dergohet...";


    try {

        const formData =
            new URLSearchParams();

        formData.append(
            "message",
            message
        );


        await fetch(
            SCRIPT_URL,
            {
                method: "POST",

                mode: "no-cors",

                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8"
                },

                body:
                    formData.toString()
            }
        );


        // Pastro input

        messageInput.value = "";

        counter.textContent =
            "0 / 1500";


        // Shko te faqja finale

        showPage(5);


    } catch (error) {

        console.error(
            "Gabim gjate dergimit:",
            error
        );


        sendBtn.disabled = false;

        sendBtn.innerHTML =
            "Dergo mesazhin <span>→</span>";


        alert(
            "Nuk u dergua mesazhi. Provo perseri."
        );

    }

});
