

interface QueryObject {
    [key: string]: string;
};

interface UrlInfoObject {
    path: string;
    query: QueryObject
};

export interface ControllerParams extends UrlInfoObject {
    method: string;
};

export const parseUrl = (url: string): UrlInfoObject => {
    const { pathname: path, search } = new URL(url);

    const query: QueryObject = {};

    for (let [k, v] of (new URLSearchParams(search))) {
        k = k?.trim();
        v = v?.trim();
        if (v && v) {
            query[k] = v;
        }
    };

    // const query = search.slice(1)
    //     .split("&")
    //     .reduce((o: QueryObject, r: string) => {
    //         let [k, v] = r.split("=");
    //         k = k?.trim();
    //         v = v?.trim();
    //         if (k && v) {
    //             o[k] = v;
    //         }
    //         return o;
    //     }, {});

    return {
        path,
        query
    };
};

export const buildUrl = (url: string, query: QueryObject): string => {
    const str = Object.keys(query)
        .map(k => k + '=' + query[k])
        .join("&");
    return url + "?" + str;
};