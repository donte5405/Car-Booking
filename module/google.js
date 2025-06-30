//@ts-check
const googleAppUrl = "https://script.google.com/macros/s/AKfycbx9bcU0Xp7XYAMnXCBBX6V6AusFhb1dOV2OAQaEURj_KBCMDeGHZ3gStvHdsIG8gHyS/exec";

/**
 * Make a request.
 * @param {Record<string, any>} body
 * @returns {Promise<Record<string,any>>}
 */
export async function request(body = {}) {
    if (window.location.href.indexOf("http://localhost:8080") === 0) {
        body.debug = true; // Detect debug environment.
    }
    const res = await fetch(
        googleAppUrl,
        {
            method: "POST",
            redirect: "follow",
            headers: {
                "Content-Type": "text/plain;charset=utf-8",
                // Somehow, Google wants it to be a plain text MIME.
                // And from the GAS part, it also must return as 'text/plain'.
            },
            body: JSON.stringify(body),
        },
    );
    return JSON.parse(await res.text());
}
