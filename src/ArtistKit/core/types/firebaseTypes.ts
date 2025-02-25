export type FirebaseString = {
    stringValue: string;
}

export type FirebaseStringEnum<T extends string> = {
    stringValue: T
}

export type FirebaseDate = {
    timestampValue: string;
}

export type FirebaseInteger = {
    integerValue: number;
}

export type FirebaseBoolean = {
    booleanValue: boolean;
}

export type FirebaseArray<T> = {
    arrayValue: {
        values: T[];
    };
}

export type FirebaseObject<T> = {
    mapValue: {
        fields: T;
    };
};

export type ObjectMap<T> = { [key: string]: T };
export type FirebaseMap<T> = FirebaseObject<ObjectMap<T>>;
export type FirebaseStringMap = FirebaseMap<FirebaseString>;


export function stringFirebaseMapValueToObject(firebaseMap: FirebaseStringMap): ObjectMap<string> {
    const obj: ObjectMap<string> = {};

    for (const key in firebaseMap.mapValue.fields) {
        obj[key] = firebaseMap.mapValue.fields[key].stringValue;
    }

    return obj;
}

export function optionalStringFirebaseMapValueToObject(firebaseMap?: FirebaseStringMap): ObjectMap<string> {
    return firebaseMap ? stringFirebaseMapValueToObject(firebaseMap) : {};
}