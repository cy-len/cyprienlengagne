interface EmailSenderOption {
    service_id?: string;
    template_id?: string;
    user_id?: string;
}

export async function sendEmailREST(payload: FormData, options?: EmailSenderOption, fetchFunction = fetch) {
    payload.append("service_id", options?.service_id ?? "service_n1tzx9e");
    payload.append("template_id", options?.template_id ?? "template_r3ud1rl");
    payload.append("user_id", options?.template_id ?? "rC7axLGqAK34I4QMx");

    const response = await fetchFunction("https://api.emailjs.com/api/v1.0/email/send-form", {
        method: "POST",
        body: payload
    });

    const text = await response.text();

    return text;
}