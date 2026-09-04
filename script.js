/* ============================================================
   XHEMI — BIRTHDAY LETTER
   SCRIPT.JS
   ============================================================ */


/* ============================================================
   01. CONFIGURATION
   ============================================================ */

const CONFIG = {

    googleAppsScriptUrl:
        "https://script.google.com/macros/s/AKfycbw87Edkwmfu1pCD82jVyEeZ8F9J3sBZNTrIFvXZZN6t1ajpyKyz0tB2mJvS5ZpQ1R3o/exec",

    maximumCharacters:
        1500,

    totalPages:
        5,

    candleAmount:
        5,

    musicVolume:
        0.12,

    musicFile:
        "happy-birthday.mp3"

};


/* ============================================================
   02. GLOBAL STATE
   ============================================================ */

let currentPage =
    1;

let candlesRemaining =
    CONFIG.candleAmount;

let musicPlaying =
    false;

let pageChanging =
    false;

let toastTimer =
    null;


/* ============================================================
   03. DOM REFERENCES
   ============================================================ */

const pages =
    document.querySelectorAll(".page");

const pageCounter =
    document.getElementById("pageCounter");

const progressBar =
    document.getElementById("progressBar");

const openLetterBtn =
    document.getElementById("openLetterBtn");

const blowBtn =
    document.getElementById("blowBtn");

const candleCount =
    document.getElementById("candleCount");

const nextAfterCake =
    document.getElementById("nextAfterCake");

const letterNextBtn =
    document.getElementById("letterNextBtn");

const replyBox =
    document.getElementById("replyBox");

const charCount =
    document.getElementById("charCount");

const sendReplyBtn =
    document.getElementById("sendReplyBtn");

const sendStatus =
    document.getElementById("sendStatus");

const restartBtn =
    document.getElementById("restartBtn");

const musicBtn =
    document.getElementById("musicBtn");

const musicLabel =
    document.getElementById("musicLabel");

const sparkField =
    document.getElementById("sparkField");

const petalField =
    document.getElementById("petalField");

const confettiLayer =
    document.getElementById("confetti");

const toast =
    document.getElementById("toast");

const bgMusicElement =
    document.getElementById("bgMusic");


/* ============================================================
   04. INITIALIZATION
   ============================================================ */

document.addEventListener(
    "DOMContentLoaded",
    initializeExperience
);


function initializeExperience() {

    createSparkles();

    createPetals();

    updatePageInterface();

    setupButtons();

    setupCandles();

    setupTextarea();

    setupKeyboardNavigation();

    setupVisibilityHandling();

    setupDraftSaving();

    setupLetterScroll();

    setupLetterWatcher();

    observeCandleClicks();

    setupMusic();

}


/* ============================================================
   05. MUSIC SETUP
   ============================================================ */

function setupMusic() {

    if (!bgMusicElement) {

        console.warn(
            "bgMusic element not found."
        );

        return;

    }


    bgMusicElement.src =
        CONFIG.musicFile;


    bgMusicElement.loop =
        true;


    bgMusicElement.preload =
        "auto";


    bgMusicElement.volume =
        CONFIG.musicVolume;


    bgMusicElement.addEventListener(
        "play",
        function () {

            musicPlaying =
                true;


            if (musicBtn) {

                musicBtn.classList.add(
                    "playing"
                );

            }


            if (musicLabel) {

                musicLabel.textContent =
                    "sound on";

            }

        }
    );


    bgMusicElement.addEventListener(
        "pause",
        function () {

            musicPlaying =
                false;


            if (musicBtn) {

                musicBtn.classList.remove(
                    "playing"
                );

            }


            if (musicLabel) {

                musicLabel.textContent =
                    "sound";

            }

        }
    );


    bgMusicElement.addEventListener(
        "ended",
        function () {

            musicPlaying =
                false;

        }
    );


    bgMusicElement.addEventListener(
        "error",
        function () {

            console.warn(
                "Nuk u gjet ose nuk mund të luhet happy-birthday.mp3."
            );

        }
    );

}


/* ============================================================
   06. START BIRTHDAY MUSIC
   ============================================================ */

function startBirthdayMusic() {

    if (!bgMusicElement) {

        return;

    }


    bgMusicElement.volume =
        CONFIG.musicVolume;


    const playPromise =
        bgMusicElement.play();


    if (
        playPromise !== undefined
    ) {

        playPromise
            .then(
                function () {

                    musicPlaying =
                        true;


                    if (musicBtn) {

                        musicBtn.classList.add(
                            "playing"
                        );

                    }


                    if (musicLabel) {

                        musicLabel.textContent =
                            "sound on";

                    }

                }
            )
            .catch(
                function (error) {

                    console.warn(
                        "Muzika nuk mundi të niste:",
                        error
                    );


                    musicPlaying =
                        false;

                }
            );

    }

}


/* ============================================================
   07. STOP BIRTHDAY MUSIC
   ============================================================ */

function stopBirthdayMusic() {

    if (!bgMusicElement) {

        return;

    }


    bgMusicElement.pause();

    musicPlaying =
        false;


    if (musicBtn) {

        musicBtn.classList.remove(
            "playing"
        );

    }


    if (musicLabel) {

        musicLabel.textContent =
            "sound";

    }

}


/* ============================================================
   08. BUTTON SETUP
   ============================================================ */

function setupButtons() {

    if (openLetterBtn) {

        openLetterBtn.addEventListener(
            "click",
            function () {

                startBirthdayMusic();

                goToPage(2);

            }
        );

    }


    if (blowBtn) {

        blowBtn.addEventListener(
            "click",
            function () {

                if (
                    candlesRemaining === 0
                ) {

                    goToPage(3);

                }

            }
        );

    }


    if (nextAfterCake) {

        nextAfterCake.addEventListener(
            "click",
            function () {

                goToPage(3);

            }
        );

    }


    if (letterNextBtn) {

        letterNextBtn.addEventListener(
            "click",
            function () {

                if (
                    !hasReadLetter()
                ) {

                    showToast(
                        "Lexoje letrën deri në fund ♡"
                    );

                    return;

                }


                goToPage(4);

            }
        );

    }


    if (sendReplyBtn) {

        sendReplyBtn.addEventListener(
            "click",
            submitReply
        );

    }


    if (restartBtn) {

        restartBtn.addEventListener(
            "click",
            restartExperience
        );

    }


    if (musicBtn) {

        musicBtn.addEventListener(
            "click",
            toggleMusic
        );

    }

}


/* ============================================================
   09. PAGE NAVIGATION
   ============================================================ */

function goToPage(
    targetPage
) {

    if (pageChanging) {

        return;

    }


    if (
        targetPage < 1 ||
        targetPage > CONFIG.totalPages
    ) {

        return;

    }


    if (
        targetPage === currentPage
    ) {

        return;

    }


    const oldPage =
        document.querySelector(
            `.page[data-page="${currentPage}"]`
        );


    const newPage =
        document.querySelector(
            `.page[data-page="${targetPage}"]`
        );


    if (!newPage) {

        return;

    }


    pageChanging =
        true;


    if (oldPage) {

        oldPage.classList.add(
            "leaving"
        );

    }


    setTimeout(
        function () {

            if (oldPage) {

                oldPage.classList.remove(
                    "active",
                    "leaving"
                );

            }


            newPage.classList.add(
                "active"
            );


            currentPage =
                targetPage;


            updatePageInterface();


            pageChanging =
                false;


            handlePageEntered(
                targetPage
            );

        },
        450
    );

}


/* ============================================================
   10. PAGE INTERFACE
   ============================================================ */

function updatePageInterface() {

    if (pageCounter) {

        const formattedPage =
            String(currentPage)
                .padStart(
                    2,
                    "0"
                );


        const formattedTotal =
            String(CONFIG.totalPages)
                .padStart(
                    2,
                    "0"
                );


        pageCounter.textContent =
            `${formattedPage} / ${formattedTotal}`;

    }


    if (progressBar) {

        const percentage =
            (
                currentPage /
                CONFIG.totalPages
            ) * 100;


        progressBar.style.width =
            `${percentage}%`;

    }


    pages.forEach(
        function (page) {

            const number =
                Number(
                    page.dataset.page
                );


            if (
                number === currentPage
            ) {

                page.classList.add(
                    "active"
                );

            } else {

                page.classList.remove(
                    "active"
                );

            }

        }
    );

}


/* ============================================================
   11. PAGE ENTER HANDLER
   ============================================================ */

function handlePageEntered(
    pageNumber
) {

    if (
        pageNumber === 2
    ) {

        createBirthdaySparkles();

    }


    if (
        pageNumber === 3
    ) {

        prepareLetterPage();

    }


    if (
        pageNumber === 4
    ) {

        setTimeout(
            function () {

                if (replyBox) {

                    replyBox.focus();

                }

            },
            500
        );

    }


    if (
        pageNumber === 5
    ) {

        createConfetti(
            80
        );

    }

}


/* ============================================================
   12. CANDLE SETUP
   ============================================================ */

function setupCandles() {

    const candles =
        document.querySelectorAll(
            ".candle"
        );


    candles.forEach(
        function (candle) {

            candle.addEventListener(
                "click",
                function () {

                    extinguishCandle(
                        candle
                    );

                }
            );

        }
    );


    updateCandleButton();

}


/* ============================================================
   13. EXTINGUISH CANDLE
   ============================================================ */

function extinguishCandle(
    candle
) {

    if (
        candle.classList.contains(
            "extinguished"
        )
    ) {

        return;

    }


    candle.classList.add(
        "extinguished"
    );


    candlesRemaining =
        Math.max(
            0,
            candlesRemaining - 1
        );


    updateCandleButton();

    createTinySmoke(
        candle
    );

    playCandleSound();

    buttonMicroEffect(
        candle
    );

    vibrateCandle();


    if (
        candlesRemaining === 0
    ) {

        allCandlesExtinguished();

    }

}


/* ============================================================
   14. CANDLE BUTTON
   ============================================================ */

function updateCandleButton() {

    if (!blowBtn) {

        return;

    }


    if (candleCount) {

        candleCount.textContent =
            candlesRemaining;

    }


    if (
        candlesRemaining === 0
    ) {

        blowBtn.disabled =
            false;

        blowBtn.classList.remove(
            "disabled"
        );

        blowBtn.innerHTML =
            `
            <span>
                Vazhdo
            </span>

            <span>
                →
            </span>
            `;

    } else {

        blowBtn.disabled =
            true;

        blowBtn.classList.add(
            "disabled"
        );

        blowBtn.innerHTML =
            `
            <span>
                Fik qirinjtë
            </span>

            <span id="candleCount">
                ${candlesRemaining}
            </span>
            `;

    }

}


/* ============================================================
   15. ALL CANDLES
   ============================================================ */

function allCandlesExtinguished() {

    createConfetti(
        45
    );


    showToast(
        "Të gjithë qirinjtë u fikën ♡"
    );


    if (nextAfterCake) {

        nextAfterCake.classList.remove(
            "hidden"
        );

    }

}


/* ============================================================
   16. TINY SMOKE
   ============================================================ */

function createTinySmoke(
    candle
) {

    const smoke =
        document.createElement(
            "span"
        );


    smoke.style.position =
        "fixed";


    smoke.style.width =
        "4px";


    smoke.style.height =
        "18px";


    smoke.style.borderRadius =
        "50%";


    smoke.style.background =
        "rgba(255,255,255,0.12)";


    smoke.style.filter =
        "blur(4px)";


    smoke.style.pointerEvents =
        "none";


    const rect =
        candle.getBoundingClientRect();


    smoke.style.left =
        `${rect.left + rect.width / 2}px`;


    smoke.style.top =
        `${rect.top - 15}px`;


    smoke.style.zIndex =
        "1000";


    smoke.animate(
        [
            {
                transform:
                    "translate(-50%, 0) scale(.6)",

                opacity:
                    0.5
            },

            {
                transform:
                    "translate(-30%, -40px) scale(1.5)",

                opacity:
                    0
            }
        ],
        {
            duration:
                1500,

            easing:
                "ease-out"
        }
    );


    document.body.appendChild(
        smoke
    );


    setTimeout(
        function () {

            smoke.remove();

        },
        1600
    );

}


/* ============================================================
   17. LETTER PREPARATION
   ============================================================ */

function prepareLetterPage() {

    const letter =
        document.getElementById(
            "letterText"
        );


    if (!letter) {

        return;

    }


    letter.scrollTop =
        0;


    letter.style.setProperty(
        "--read-progress",
        "0"
    );

}


/* ============================================================
   18. TEXTAREA
   ============================================================ */

function setupTextarea() {

    if (!replyBox) {

        return;

    }


    replyBox.addEventListener(
        "input",
        updateCharacterCounter
    );


    updateCharacterCounter();

}


/* ============================================================
   19. CHARACTER COUNTER
   ============================================================ */

function updateCharacterCounter() {

    if (
        !replyBox ||
        !charCount
    ) {

        return;

    }


    const length =
        replyBox.value.length;


    charCount.textContent =
        length;


    if (
        length >=
        CONFIG.maximumCharacters * 0.9
    ) {

        charCount.style.color =
            "var(--pink)";

    } else {

        charCount.style.color =
            "";

    }

}


/* ============================================================
   20. SUBMIT REPLY
   ============================================================ */

async function submitReply() {

    if (!replyBox) {

        return;

    }


    const message =
        sanitizeMessage(
            replyBox.value
        );


    if (
        message.length === 0
    ) {

        showToast(
            "Shkruaj diçka para se ta dërgosh."
        );

        replyBox.focus();

        return;

    }


    if (
        message.length >
        CONFIG.maximumCharacters
    ) {

        showToast(
            "Mesazhi është shumë i gjatë."
        );

        return;

    }


    if (
        CONFIG.googleAppsScriptUrl ===
        "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE"
    ) {

        showToast(
            "Google Sheets ende nuk është lidhur."
        );

        console.warn(
            "Vendos URL-në e Google Apps Script te CONFIG.googleAppsScriptUrl."
        );

        return;

    }


    if (sendReplyBtn) {

        sendReplyBtn.disabled =
            true;

        sendReplyBtn.style.opacity =
            "0.55";

        const buttonText =
            sendReplyBtn.querySelector(
                "span"
            );


        if (buttonText) {

            buttonText.textContent =
                "Po dërgohet...";

        }

    }


    setStatus(
        "Po dërgohet mesazhi..."
    );


    const payload = {

        reply:
            message,

        page:
            currentPage,

        language:
            navigator.language ||
            "unknown",

        userAgent:
            navigator.userAgent,

        screen:
            `${window.innerWidth}x${window.innerHeight}`,

        timestamp:
            new Date().toISOString()

    };


    try {

        await fetch(
            CONFIG.googleAppsScriptUrl,
            {

                method:
                    "POST",

                mode:
                    "no-cors",

                headers:
                    {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                body:
                    JSON.stringify(
                        payload
                    )

            }
        );


        markReplySent();


        setStatus(
            "Mesazhi u dërgua ♡"
        );


        showToast(
            "Mesazhi u dërgua."
        );


        createConfetti(
            35
        );


        setTimeout(
            function () {

                goToPage(5);

            },
            1100
        );


    } catch (error) {

        console.error(
            "Submit error:",
            error
        );


        setStatus(
            "Diçka nuk shkoi. Provo përsëri."
        );


        if (sendReplyBtn) {

            sendReplyBtn.disabled =
                false;

            sendReplyBtn.style.opacity =
                "";


            const buttonText =
                sendReplyBtn.querySelector(
                    "span"
                );


            if (buttonText) {

                buttonText.textContent =
                    "Dërgo mesazhin";

            }

        }

    }

}


/* ============================================================
   21. STATUS MESSAGE
   ============================================================ */

function setStatus(
    message
) {

    if (!sendStatus) {

        return;

    }


    sendStatus.textContent =
        message;

}


/* ============================================================
   22. RESTART
   ============================================================ */

function restartExperience() {

    currentPage =
        1;


    candlesRemaining =
        CONFIG.candleAmount;


    const candles =
        document.querySelectorAll(
            ".candle"
        );


    candles.forEach(
        function (candle) {

            candle.classList.remove(
                "extinguished"
            );

        }
    );


    if (replyBox) {

        replyBox.value =
            "";

    }


    updateCharacterCounter();


    if (sendReplyBtn) {

        sendReplyBtn.disabled =
            false;

        sendReplyBtn.style.opacity =
            "";


        const span =
            sendReplyBtn.querySelector(
                "span"
            );


        if (span) {

            span.textContent =
                "Dërgo mesazhin";

        }

    }


    if (sendStatus) {

        sendStatus.textContent =
            "";

    }


    if (nextAfterCake) {

        nextAfterCake.classList.add(
            "hidden"
        );

    }


    pages.forEach(
        function (page) {

            page.classList.remove(
                "active",
                "leaving"
            );

        }
    );


    const firstPage =
        document.getElementById(
            "page1"
        );


    if (firstPage) {

        firstPage.classList.add(
            "active"
        );

    }


    updatePageInterface();

}


/* ============================================================
   23. KEYBOARD NAVIGATION
   ============================================================ */

function setupKeyboardNavigation() {

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                return;

            }


            if (
                event.key ===
                "ArrowRight"
            ) {

                if (
                    currentPage === 1
                ) {

                    goToPage(2);

                }

            }


            if (
                event.key ===
                "ArrowLeft"
            ) {

                if (
                    currentPage > 1
                ) {

                    goToPage(
                        currentPage - 1
                    );

                }

            }

        }
    );

}


/* ============================================================
   24. VISIBILITY
   ============================================================ */

function setupVisibilityHandling() {

    document.addEventListener(
        "visibilitychange",
        function () {

            if (
                document.hidden
            ) {

                if (
                    bgMusicElement &&
                    !bgMusicElement.paused
                ) {

                    bgMusicElement.pause();

                }

            } else {

                if (
                    musicPlaying &&
                    bgMusicElement
                ) {

                    bgMusicElement
                        .play()
                        .catch(
                            function (error) {

                                console.warn(
                                    "Muzika nuk rifilloi:",
                                    error
                                );

                            }
                        );

                }

            }

        }
    );

}


/* ============================================================
   25. SPARKLE GENERATOR
   ============================================================ */

function createSparkles() {

    if (!sparkField) {

        return;

    }


    const amount =
        window.innerWidth < 600
            ? 35
            : 65;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const spark =
            document.createElement(
                "span"
            );


        spark.className =
            "spark";


        spark.style.left =
            `${Math.random() * 100}%`;


        spark.style.top =
            `${Math.random() * 100}%`;


        spark.style.setProperty(
            "--duration",
            `${5 + Math.random() * 8}s`
        );


        spark.style.setProperty(
            "--blink",
            `${1.5 + Math.random() * 3}s`
        );


        spark.style.setProperty(
            "--drift",
            `${-30 + Math.random() * 60}px`
        );


        spark.style.animationDelay =
            `${Math.random() * 6}s`;


        const size =
            1 + Math.random() * 3;


        spark.style.width =
            `${size}px`;


        spark.style.height =
            `${size}px`;


        sparkField.appendChild(
            spark
        );

    }

}


/* ============================================================
   26. PETAL GENERATOR
   ============================================================ */

function createPetals() {

    if (!petalField) {

        return;

    }


    const amount =
        window.innerWidth < 600
            ? 9
            : 16;


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const petal =
            document.createElement(
                "span"
            );


        petal.className =
            "petal";


        petal.style.left =
            `${Math.random() * 100}%`;


        petal.style.setProperty(
            "--fall",
            `${12 + Math.random() * 15}s`
        );


        petal.style.setProperty(
            "--sway",
            `${-100 + Math.random() * 200}px`
        );


        petal.style.animationDelay =
            `${-Math.random() * 15}s`;


        petal.style.transform =
            `scale(${0.5 + Math.random() * 0.8})`;


        petalField.appendChild(
            petal
        );

    }

}


/* ============================================================
   27. BIRTHDAY SPARKLES
   ============================================================ */

function createBirthdaySparkles() {

    for (
        let i = 0;
        i < 18;
        i++
    ) {

        const sparkle =
            document.createElement(
                "span"
            );


        sparkle.className =
            "spark";


        sparkle.style.position =
            "fixed";


        sparkle.style.left =
            `${35 + Math.random() * 30}%`;


        sparkle.style.top =
            `${35 + Math.random() * 30}%`;


        sparkle.style.zIndex =
            "50";


        sparkle.style.animation =
            "softReveal 1s ease both";


        sparkle.style.animationDelay =
            `${i * 0.05}s`;


        document.body.appendChild(
            sparkle
        );


        sparkle.animate(
            [
                {
                    transform:
                        "translate(0,0) scale(.3)",

                    opacity:
                        0
                },

                {
                    transform:
                        `translate(
                            ${(Math.random() - 0.5) * 250}px,
                            ${(Math.random() - 0.5) * 220}px
                        ) scale(1.5)`,

                    opacity:
                        1
                },

                {
                    opacity:
                        0
                }
            ],
            {
                duration:
                    1800,

                easing:
                    "cubic-bezier(.2,.8,.2,1)"
            }
        );


        setTimeout(
            function () {

                sparkle.remove();

            },
            1900
        );

    }

}


/* ============================================================
   28. CONFETTI
   ============================================================ */

function createConfetti(
    amount = 50
) {

    if (!confettiLayer) {

        return;

    }


    const shapes = [
        "3px",
        "5px",
        "7px",
        "9px"
    ];


    const symbols = [
        "♡",
        "✦",
        "•",
        "◆"
    ];


    for (
        let i = 0;
        i < amount;
        i++
    ) {

        const piece =
            document.createElement(
                "span"
            );


        piece.className =
            "confetti-piece";


        piece.style.left =
            `${Math.random() * 100}%`;


        piece.style.width =
            shapes[
                Math.floor(
                    Math.random() *
                    shapes.length
                )
            ];


        piece.style.height =
            `${8 + Math.random() * 10}px`;


        piece.style.setProperty(
            "--duration",
            `${2.2 + Math.random() * 2.4}s`
        );


        piece.style.setProperty(
            "--x",
            `${-160 + Math.random() * 320}px`
        );


        piece.style.setProperty(
            "--rotation",
            `${360 + Math.random() * 900}deg`
        );


        piece.style.background =
            getConfettiColor();


        if (
            Math.random() > 0.55
        ) {

            piece.textContent =
                symbols[
                    Math.floor(
                        Math.random() *
                        symbols.length
                    )
                ];


            piece.style.background =
                "transparent";


            piece.style.color =
                getConfettiColor();


            piece.style.fontSize =
                `${10 + Math.random() * 10}px`;

        }


        piece.style.animationDelay =
            `${Math.random() * 0.5}s`;


        confettiLayer.appendChild(
            piece
        );


        setTimeout(
            function () {

                piece.remove();

            },
            5200
        );

    }

}


/* ============================================================
   29. CONFETTI COLOR
   ============================================================ */

function getConfettiColor() {

    const colors = [

        "#e8a7b7",

        "#d9b87a",

        "#f5eadc",

        "#b98b98",

        "#ffffff"

    ];


    return colors[
        Math.floor(
            Math.random() *
            colors.length
        )
    ];

}


/* ============================================================
   30. TOAST
   ============================================================ */

function showToast(
    message
) {

    if (!toast) {

        return;

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            function () {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );

 }


/* ============================================================
   31. INTERFACE SOUND
   ============================================================ */

function playInterfaceSound() {

    /*
        Nuk përdorim më Web Audio API për muzikën.
        Muzika kryesore është happy-birthday.mp3.

        Ky funksion mbetet bosh që pjesët e tjera të
        eksperiencës të mos kenë nevojë të ndryshohen.
    */

    return;

}


/* ============================================================
   32. CANDLE SOUND
   ============================================================ */

function playCandleSound() {

    /*
        Qirinjtë nuk kanë më oscillator-in e vjetër.
        Muzika kryesore vazhdon të luajë normalisht.
    */

    return;

}


/* ============================================================
   33. MUSIC TOGGLE
   ============================================================ */

function toggleMusic() {

    if (!bgMusicElement) {

        showToast(
            "Muzika nuk u gjet."
        );

        return;

    }


    if (
        !bgMusicElement.paused
    ) {

        stopBirthdayMusic();

        return;

    }


    startBirthdayMusic();

}


/* ============================================================
   34. TOUCH SUPPORT
   ============================================================ */

document.addEventListener(
    "touchstart",
    function () {

        /*
            Nuk nisim muzikën këtu automatikisht.
            Muzika nis te klikimi "Hape letrën",
            i cili është një user interaction.
        */

    },
    {
        passive: true
    }
);


/* ============================================================
   35. WINDOW RESIZE
   ============================================================ */

window.addEventListener(
    "resize",
    function () {

        document.documentElement
            .style
            .setProperty(
                "--viewport-height",
                `${window.innerHeight}px`
            );

    }
);


/* ============================================================
   36. BEFORE UNLOAD
   ============================================================ */

window.addEventListener(
    "beforeunload",
    function () {

        try {

            if (bgMusicElement) {

                bgMusicElement.pause();

            }

        } catch (error) {

            console.warn(
                error
            );

        }

    }
);


/* ============================================================
   37. DOUBLE CLICK PROTECTION
   ============================================================ */

function preventRapidClicks(
    button,
    callback,
    delay = 700
) {

    if (!button) {

        return;

    }


    let locked =
        false;


    button.addEventListener(
        "click",
        function (event) {

            if (locked) {

                event.preventDefault();

                return;

            }


            locked =
                true;


            callback(event);


            setTimeout(
                function () {

                    locked =
                        false;

                },
                delay
            );

        }
    );

}


/* ============================================================
   38. SAFE TEXT
   ============================================================ */

function sanitizeMessage(
    value
) {

    if (
        typeof value !==
        "string"
    ) {

        return "";

    }


    return value
        .replace(
            /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,
            ""
        )
        .trim();

}


/* ============================================================
   39. LOCAL BACKUP
   ============================================================ */

function saveLocalDraft() {

    if (!replyBox) {

        return;

    }


    const message =
        sanitizeMessage(
            replyBox.value
        );


    try {

        localStorage.setItem(
            "xhemi_letter_draft",
            message
        );

    } catch (error) {

        console.warn(
            "Local storage unavailable.",
            error
        );

    }

}


/* ============================================================
   40. LOAD LOCAL BACKUP
   ============================================================ */

function loadLocalDraft() {

    if (!replyBox) {

        return;

    }


    try {

        const saved =
            localStorage.getItem(
                "xhemi_letter_draft"
            );


        if (
            saved &&
            saved.length > 0
        ) {

            replyBox.value =
                saved;

            updateCharacterCounter();

        }

    } catch (error) {

        console.warn(
            "Could not load draft.",
            error
        );

    }

}


/* ============================================================
   41. DRAFT AUTOSAVE
   ============================================================ */

function setupDraftSaving() {

    if (!replyBox) {

        return;

    }


    replyBox.addEventListener(
        "input",
        function () {

            saveLocalDraft();

        }
    );


    loadLocalDraft();

}


/* ============================================================
   42. CLEAR DRAFT
   ============================================================ */

function clearLocalDraft() {

    try {

        localStorage.removeItem(
            "xhemi_letter_draft"
        );

    } catch (error) {

        console.warn(
            error
        );

    }

}


/* ============================================================
   43. SEND COMPLETE EVENT
   ============================================================ */

function markReplySent() {

    clearLocalDraft();


    if (replyBox) {

        replyBox.value =
            "";

    }


    updateCharacterCounter();

}


/* ============================================================
   44. PAGE 4 VALIDATION
   ============================================================ */

function validateReply() {

    if (!replyBox) {

        return false;

    }


    const message =
        sanitizeMessage(
            replyBox.value
        );


    if (!message) {

        return false;

    }


    if (
        message.length >
        CONFIG.maximumCharacters
    ) {

        return false;

    }


    return true;

}


/* ============================================================
   45. MOBILE VIBRATION
   ============================================================ */

function softVibrate(
    duration = 15
) {

    if (
        "vibrate" in navigator
    ) {

        try {

            navigator.vibrate(
                duration
            );

        } catch (error) {

            console.warn(
                error
            );

        }

    }

}


/* ============================================================
   46. CANDLE VIBRATION
   ============================================================ */

function vibrateCandle() {

    softVibrate(
        18
    );

}


/* ============================================================
   47. BUTTON MICRO EFFECT
   ============================================================ */

function buttonMicroEffect(
    element
) {

    if (!element) {

        return;

    }


    element.animate(
        [
            {
                transform:
                    "scale(1)"
            },

            {
                transform:
                    "scale(.96)"
            },

            {
                transform:
                    "scale(1)"
            }
        ],
        {
            duration:
                180,

            easing:
                "ease-out"
        }
    );

}


/* ============================================================
   48. OBSERVE CANDLES
   ============================================================ */

function observeCandleClicks() {

    /*
        Ky funksion nuk shton më event listener
        të dytë te qirinjtë.

        Efekti bëhet direkt te extinguishCandle().
    */

    return;

}


/* ============================================================
   49. LETTER SCROLL EFFECT
   ============================================================ */

function setupLetterScroll() {

    const letter =
        document.getElementById(
            "letterText"
        );


    if (!letter) {

        return;

    }


    letter.addEventListener(
        "scroll",
        function () {

            const maximum =
                letter.scrollHeight -
                letter.clientHeight;


            if (
                maximum <= 0
            ) {

                letter.style.setProperty(
                    "--read-progress",
                    "1"
                );

                return;

            }


            const percentage =
                letter.scrollTop /
                maximum;


            letter.style.setProperty(
                "--read-progress",
                percentage
            );


            updateLetterButton();

        }
    );

}


/* ============================================================
   50. READING COMPLETE CHECK
   ============================================================ */

function hasReadLetter() {

    const letter =
        document.getElementById(
            "letterText"
        );


    if (!letter) {

        return false;

    }


    const maximum =
        letter.scrollHeight -
        letter.clientHeight;


    if (
        maximum <= 10
    ) {

        return true;

    }


    return (
        letter.scrollTop >=
        maximum - 30
    );

}


/* ============================================================
   51. LETTER BUTTON MICRO TEXT
   ============================================================ */

function updateLetterButton() {

    if (!letterNextBtn) {

        return;

    }


    if (
        hasReadLetter()
    ) {

        letterNextBtn.style.opacity =
            "1";

        letterNextBtn.removeAttribute(
            "aria-disabled"
        );

    }

}


/* ============================================================
   52. LETTER SCROLL WATCHER
   ============================================================ */

function setupLetterWatcher() {

    const letter =
        document.getElementById(
            "letterText"
        );


    if (!letter) {

        return;

    }


    letter.addEventListener(
        "scroll",
        updateLetterButton
    );

}


/* ============================================================
   53. EXTRA FEATURES
   ============================================================ */

function initializeExtraFeatures() {

    /*
        Funksionet ekstra tashmë inicializohen
        nga initializeExperience().
    */

    return;

}


/* ============================================================
   54. DEBUG HELPERS
   ============================================================ */

window.XhemiExperience = {

    getCurrentPage:
        function () {

            return currentPage;

        },


    goTo:
        function (page) {

            goToPage(
                Number(page)
            );

        },


    reset:
        function () {

            restartExperience();

        },


    startSound:
        function () {

            startBirthdayMusic();

        },


    stopSound:
        function () {

            stopBirthdayMusic();

        },


    isMusicPlaying:
        function () {

            return musicPlaying;

        }

};


/* ============================================================
   55. SAFETY CHECK
   ============================================================ */

if (
    !openLetterBtn
) {

    console.warn(
        "openLetterBtn not found."
    );

}


if (
    !blowBtn
) {

    console.warn(
        "blowBtn not found."
    );

}


if (
    !replyBox
) {

    console.warn(
        "replyBox not found."
    );

}


if (
    !bgMusicElement
) {

    console.warn(
        "bgMusic element not found. Shto <audio id=\"bgMusic\"> në index.html."
    );

}


/* ============================================================
   56. AUDIO FILE CHECK
   ============================================================ */

function checkMusicFile() {

    if (!bgMusicElement) {

        return;

    }


    bgMusicElement.addEventListener(
        "canplaythrough",
        function () {

            console.log(
                "happy-birthday.mp3 është gati për t'u luajtur."
            );

        },
        {
            once: true
        }
    );

}


/* ============================================================
   57. PAGE LOAD MUSIC PREPARATION
   ============================================================ */

function prepareMusic() {

    if (!bgMusicElement) {

        return;

    }


    bgMusicElement.volume =
        CONFIG.musicVolume;


    bgMusicElement.loop =
        true;


    bgMusicElement.preload =
        "auto";


    bgMusicElement.load();

}


/* ============================================================
   58. INITIAL MUSIC PREPARATION
   ============================================================ */

prepareMusic();

checkMusicFile();


/* ============================================================
   59. INITIAL UI SAFETY
   ============================================================ */

if (candleCount) {

    candleCount.textContent =
        candlesRemaining;

}


if (musicLabel) {

    musicLabel.textContent =
        "sound";

}


/* ============================================================
   60. FINISH
   ============================================================ */

console.log(
    "Xhemi Birthday Experience initialized."
);

console.log(
    "Birthday music: happy-birthday.mp3"
);


/* ============================================================
   END OF SCRIPT.JS
   ============================================================ */
