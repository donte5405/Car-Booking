//@ts-check
/**
 * Make a request.
 * @param {string} params
 * @param {Record<string, any>} body
 */
export async function request(params, body) {
    const res = await fetch(
        window["googleAppUrl"] + (params ? "?" + params : ""),
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
