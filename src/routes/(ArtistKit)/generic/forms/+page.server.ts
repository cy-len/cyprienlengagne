import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { verifyCaptchaToken } from "../../../../ArtistKit/core/rest/captcha";
import { artkytClient } from "../../../../artkyt/artkytClient.svelte";

export const actions: Actions = {
    sendContactMessage: async ({ request, fetch }) => {
        const data = await request.formData();
        const email = data.get("from_email")?.toString();
        const name = data.get("from_name")?.toString();
        const message = data.get("message")?.toString();
        const captcha = data.get("captcha")?.toString();

        if (!captcha || !email || !name || !message) {
            return fail(422, {
                captchaMissing: !captcha,
                emailMissing: !email,
                nameMissing: !name,
                messageMissing: !message
            });
        }

        try {
            const captchaResponse = await verifyCaptchaToken(captcha, fetch);

            if (!captchaResponse.success) {
                return fail(400, { captchaFailed: true });
            }

            const result = await artkytClient.postContactMessage({
                fromName: name,
                fromEmail: email,
                content: message
            });

            if (!result.success) {
                throw new Error(result.error.message);
            }
        } catch (error: any) {
            console.log(error);
            return fail(error.code, error);
        }

        return { success: true, email, name, message };
    }
};