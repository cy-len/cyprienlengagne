import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { createDocumentFirebaseREST } from "../../../firebase/firebaseUtils";
import { sendEmailREST } from "../../../utils/emailUtils";
import { verifyCaptchaToken } from "../../../utils/secureUtils";

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

            const [ firebaseResponse, emailJsResponse ] = await Promise.all([
                createDocumentFirebaseREST({
                    name: {
                        stringValue: name
                    },
                    email: {
                        stringValue: email
                    },
                    message: {
                        stringValue: message
                    },
                    date: {
                        timestampValue: (new Date()).toISOString()
                    }
                }, "contactMessages", fetch),
                sendEmailREST(data, undefined, fetch)
            ]);

            if (firebaseResponse.error) {
                return fail(firebaseResponse.error.code, firebaseResponse.error);
            }
        } catch (error: any) {
            console.log(error);
            return fail(error.code, error);
        }

        return { success: true, email, name, message };
    }
};