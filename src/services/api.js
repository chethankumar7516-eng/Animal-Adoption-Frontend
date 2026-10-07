import axios from "axios";

const API = axios.create({
    baseURL: "https://animal-adoption-backend-1.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});


// ======================================================
// ADD AUTH TOKEN AUTOMATICALLY
// ======================================================

API.interceptors.request.use(
    (config) => {

        const url = config.url || "";

        // ==================================================
        // DO NOT CHANGE MANUALLY PROVIDED AUTHORIZATION
        // ==================================================

        if (
            config.headers &&
            config.headers.Authorization
        ) {
            return config;
        }


        let token = null;


        // ==================================================
        // PROVIDER API
        // ==================================================

        if (
            url.includes("/provider/") ||
            url.includes("/service/provider-requests") ||
            url.includes("/service/request/")
        ) {
            token =
                localStorage.getItem("providerToken");
        }


        // ==================================================
        // USER API
        // ==================================================

        else if (
            url.includes("/user/") ||
            url.includes("/users/") ||
            url.includes("/service/user-requests") ||
            url.includes("/service/sendrequest") ||
            url.includes("/messages/user")
        ) {
            token =
                localStorage.getItem("userToken");
        }


        // ==================================================
        // PET GET REQUESTS
        // ==================================================
        // /pets is public.
        // Therefore DON'T attach providerToken automatically.
        //
        // Provider add/update/delete requests will still get
        // providerToken because their URLs are handled below.
        // ==================================================


        // ==================================================
        // PET PROVIDER OPERATIONS
        // ==================================================

        if (
            url.includes("/pets/add") ||
            (
                url.match(/\/pets\/[^/]+$/) &&
                config.method &&
                ["put", "delete"].includes(
                    config.method.toLowerCase()
                )
            )
        ) {
            token =
                localStorage.getItem("providerToken");
        }


        // ==================================================
        // ATTACH TOKEN
        // ==================================================

        if (token) {

            config.headers = config.headers || {};

            config.headers.Authorization =
                `Bearer ${token}`;
        }


        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


export default API;