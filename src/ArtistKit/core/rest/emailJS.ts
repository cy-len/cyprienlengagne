import { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID } from "$env/static/private";

interface EmailSenderOption {
    service_id?: string;
    template_id?: string;
    user_id?: string;
}

export async function sendEmailREST(payload: FormData, options?: EmailSenderOption, fetchFunction = fetch) {
    payload.append("service_id", options?.service_id ?? EMAILJS_SERVICE_ID);
    payload.append("template_id", options?.template_id ?? EMAILJS_TEMPLATE_ID);
    payload.append("user_id", options?.template_id ?? EMAILJS_USER_ID);

    const response = await fetchFunction("https://api.emailjs.com/api/v1.0/email/send-form", {
        method: "POST",
        body: payload
    });

    const text = await response.text();

    return text;
}