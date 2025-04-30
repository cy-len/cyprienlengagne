import { PUBLIC_FIREBASE_PROJECT_ID } from "$env/static/public";

interface FirebaseReturn<T> {
    document: {
        createTime: string;
        name: string;
        updateTime: string;
        fields: T;
    };
    readTime: string;
}

interface FirebaseAggregationReturn {
    result: {
        aggregateFields: { [key: string]: any };
    };
    readTime: string;
}

export async function queryFirebaseREST<T>(query: object, fetchFunction = fetch): Promise<FirebaseReturn<T>[]> {
    const res = await fetchFunction(`https://firestore.googleapis.com/v1/projects/${PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents:runQuery`, {
        method: "POST",
        body: JSON.stringify(query)
    });

    return res.json();
}

export async function queryFirebaseAggregationREST(query: object, fetchFunction = fetch): Promise<FirebaseAggregationReturn[]> {
    const res = await fetchFunction(`https://firestore.googleapis.com/v1/projects/${PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents:runAggregationQuery`, {
        method: "POST",
        body: JSON.stringify(query)
    });

    return res.json();
}

export async function queryCountREST(collectionId: string, fetchFunction = fetch): Promise<number> {
    const countRaw = await queryFirebaseAggregationREST({
        structuredAggregationQuery: {
            aggregations: [
                {
                    count: {},
                },
            ],
            structuredQuery: {
                from: [{ collectionId }],
            },
        },
    }, fetchFunction);

    return parseInt(countRaw[0]?.result.aggregateFields.field_1?.integerValue ?? "-1");
}

export async function createDocumentFirebaseREST(fields: object, collectionPath: string, fetchFunction = fetch) {
    const response = await fetchFunction(`https://firestore.googleapis.com/v1/projects/${PUBLIC_FIREBASE_PROJECT_ID}/databases/(default)/documents/${collectionPath}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fields
        })
    });

    const json = await response.json();

    return json;
}