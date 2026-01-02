export function initLoginEffects() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    // ---------- INPUT FOCUS EFFECT ----------
    const inputs = form.querySelectorAll("input");
    inputs.forEach((input) => {
        input.addEventListener("focus", () => {
            input.closest(".input-wrapper")?.classList.add("focused");
        });

        input.addEventListener("blur", () => {
            input.closest(".input-wrapper")?.classList.remove("focused");
        });
    });

    // ---------- STAGGER ANIMATION ----------
    inputs.forEach((input, index) => {
        input.setAttribute(
            "style",
            "opacity:0; transform:translateY(10px)"
        );

        setTimeout(() => {
            input.setAttribute(
                "style",
                "opacity:1; transform:translateY(0); transition:all .4s ease"
            );
        }, index * 120);
    });

    // ---------- CHECKBOX ANIMATION ----------
    const checkbox = document.getElementById("remember");
    checkbox?.addEventListener("change", () => {
        const checkmark = document.querySelector(".checkmark") as HTMLElement;
        if (!checkmark) return;

        checkmark.style.transform = "scale(0.85)";
        setTimeout(() => {
            checkmark.style.transform = "scale(1)";
        }, 150);
    });

    // ---------- BUTTON PRESS EFFECT ----------
    const buttons = document.querySelectorAll("button");
    buttons.forEach((btn) => {
        btn.addEventListener("mousedown", () => {
            (btn as HTMLElement).style.transform = "scale(0.96)";
        });

        btn.addEventListener("mouseup", () => {
            (btn as HTMLElement).style.transform = "scale(1)";
        });
    });
}
