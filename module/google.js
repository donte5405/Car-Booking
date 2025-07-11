//@ts-check
const googleAppUrl = "https://script.google.com/macros/s/AKfycbxsXqp_H6XBAd1cd0HJGYE7N2HE49xFQK1H_kpKNNlBUjlXyGBBnz2Vqx2FFeqIUz6W/exec";

/**
 * Make a request.
 * @param {Record<string, any>} body
 * @returns {Promise<Record<string,any>>}
 */
export async function request(body = {}) {
    const session = window.sessionStorage.getItem("session");
    if (window.location.href.indexOf("http://") === 0) {
        body.debug = true; // Detect debug environment.
    }
    if (session) {
        console.log("session detected.");
        body.session = session;
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
    const data = JSON.parse(await res.text());
    if (data.session) {
        window.sessionStorage.setItem("session", data.session);
        console.log("new session saved");
    }
    return data;
}
