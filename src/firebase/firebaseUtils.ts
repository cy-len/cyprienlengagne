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
    const res = await fetchFunction("https://firestore.googleapis.com/v1/projects/cyprienlengagne-73f1d/databases/(default)/documents:runQuery", {
        method: "POST",
        body: JSON.stringify(query)
    });

    return res.json();
}

export async function queryFirebaseAggregationREST(query: object, fetchFunction = fetch): Promise<FirebaseAggregationReturn[]> {
    const res = await fetchFunction("https://firestore.googleapis.com/v1/projects/cyprienlengagne-73f1d/databases/(default)/documents:runAggregationQuery", {
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