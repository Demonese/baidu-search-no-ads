"use strict";

console.log("Clean Baidu Search");

/**
 * @param {Element} e
 */
function fixHref(e) {
    if (e.hasAttribute("__href_fixed")) {
        return;
    }
    const mu = e.getAttribute("mu");
    if (typeof mu === "string") {
        //console.log("mu", mu);
        const scLink = e.getElementsByClassName("sc-link");
        for (const c of scLink) {
            if (c instanceof HTMLAnchorElement) {
                /**@type {HTMLAnchorElement} */
                const a = c;
                a.href = mu;
            }
        }
        const sourceText = e.getElementsByClassName("cosc-source-text")
        for (const c of sourceText) {
            if (c instanceof HTMLSpanElement) {
                /**@type {HTMLSpanElement} */
                const span = c;
                if (span.innerText.indexOf("") !== -1) {
                    span.innerText = mu;
                }
            }
        }
        e.setAttribute("__href_fixed", "1");
    }
}

/**
 * @param {Element} e
 * @returns {boolean}
 */
function hasAdTag(e) {
    const list = e.querySelectorAll("div > a");
    for (const a of list) {
        //console.log(a);
        if (a.textContent.indexOf("广告") !== -1) {
            console.log('found ad', e);
            return true;
        }
    }
    return false;
}

function cleanAds() {
    const contentLeft = document.querySelectorAll("#content_left");
    for (const e of contentLeft) {
        /**@type {Element[]} */
        const ads = [];
        for (const c of e.children) {
            if (!c.classList.contains("result")) {
                console.log('found ad', c);
                ads.push(c);
                continue;
            }
            if (hasAdTag(c)) {
                ads.push(c);
                continue;
            }
            fixHref(c);
        }
        for (const ad of ads) {
            e.removeChild(ad);
        }
    }

    const contentRight = document.querySelectorAll("#content_right");
    for (const e of contentRight) {
        console.log('found content_right', e);
        e.parentNode.removeChild(e);
    }

    const appRs = document.querySelectorAll("div[tpl='app/rs']");
    for (const e of appRs) {
        console.log('found app/rs', e);
        e.parentNode.removeChild(e);
    }
}

document.addEventListener('DOMContentLoaded', (ev) => {
    console.log("DOMContentLoaded");
    cleanAds();
    const observer = new MutationObserver((mutations, observer) => {
        cleanAds();
    });
    observer.observe(document.body, {
        childList: true,
        characterData: true,
        subtree: true,
    })
}, false);
