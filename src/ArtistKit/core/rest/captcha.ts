import { RECAPTCHA_SECRET_KEY } from "$env/static/private";

export interface ReCaptchaResponse {
    success: boolean;
    challenge_ts: string;
    hostname: string;
    "error-codes": number[];
}

export async function verifyCaptchaToken(token: string, fetchFunction = fetch): Promise<ReCaptchaResponse> {
    const response = await fetchFunction(
        "https://www.google.com/recaptcha/api/siteverify",
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret: RECAPTCHA_SECRET_KEY,
                response: token
            })
        }
    );

    return response.json();
}