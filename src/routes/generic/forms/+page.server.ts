import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { createDocumentFirebaseREST } from "../../../firebase/firebaseUtils";
import { sendEmailREST } from "../../../utils/emailUtils";

export const actions: Actions = {
    sendContactMessage: async ({ request, fetch }) => {
        const data = await request.formData();
        const email = data.get("from_email");
        const name = data.get("from_name");
        const message = data.get("message");

        if (!email) {
            return fail(422, { emailMissing: true });
        }
        if (!name) {
            return fail(422, { nameMissing: true });
        }
        if (!message) {
            return fail(422, { messageMissing: true });
        }

        try {
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