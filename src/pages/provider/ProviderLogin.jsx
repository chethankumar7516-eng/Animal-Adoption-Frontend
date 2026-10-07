import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

function ProviderLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post("/providers/login", {
                email: email,
                password: password,
            });

            console.log("PROVIDER LOGIN RESPONSE:", response.data);

            if (!response.data?.success) {
                setError(
                    response.data?.message || "Login failed"
                );
                return;
            }
            console.log(response.data);
            const token = response.data?.token;
            const provider = response.data?.provider;
            const providerId = provider?.id;
            console.log(providerId);

            if (!token || !provider) {
                setError("Invalid login response from server");
                return;
            }

            localStorage.setItem("providerToken", token);

            localStorage.setItem("providerId", providerId);
            localStorage.setItem(
                "providerName",
                provider.name || ""
            );

            localStorage.setItem(
                "providerEmail",
                provider.email || ""
            );

            navigate("/provider/dashboard", {
                replace: true,
            });
        } catch (err) {
            console.error("Provider login error:", err);

            setError(
                err.response?.data?.message ||
                "Invalid email or password"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FAF6F0] px-5">

            <div className="w-full max-w-md rounded-3xl border border-[#E6DCCF] bg-white p-8 shadow-lg">

                {/* LOGO */}
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B5A2B] text-white">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.5 1c-.83 0-1.5.67-1.5 1.5S7.67 14 8.5 14s1.5-.67 1.5-1.5S9.33 11 8.5 11zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                        </svg>
                    </div>

                    <h1 className="mt-4 text-3xl font-black text-[#3D2314]">
                        PetConnect
                    </h1>

                    <p className="mt-1 text-sm text-[#A06C3F]">
                        Provider Portal
                    </p>
                </div>

                {/* TITLE */}
                <div className="mb-6">
                    <h2 className="text-2xl font-black text-[#3D2314]">
                        Provider Login
                    </h2>

                    <p className="mt-2 text-sm text-[#6E5D4F]">
                        Login to manage your pets and adoption requests.
                    </p>
                </div>

                {/* ERROR */}
                {error && (
                    <div className="mb-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                        <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* EMAIL */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-2 block text-sm font-bold text-[#3D2314]"
                        >
                            Email
                        </label>

                        <div className="relative">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                disabled={loading}
                                className="w-full rounded-xl border border-[#E6DCCF] py-3 pl-11 pr-4 outline-none transition focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#A06C3F]">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* PASSWORD */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-bold text-[#3D2314]"
                        >
                            Password
                        </label>

                        <div className="relative">
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                required
                                disabled={loading}
                                className="w-full rounded-xl border border-[#E6DCCF] py-3 pl-11 pr-4 outline-none transition focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20 disabled:cursor-not-allowed disabled:bg-gray-100"
                            />
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-[#A06C3F]">
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B5A2B] px-5 py-3.5 font-bold text-white transition hover:bg-[#724820] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <>
                                <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Logging in...</span>
                            </>
                        ) : (
                            <>
                                <span>Login</span>
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </>
                        )}
                    </button>

                </form>

                {/* REGISTER */}
                <p className="mt-6 text-center text-sm text-[#6E5D4F]">
                    Don't have a provider account?{" "}

                    <Link
                        to="/provider/register"
                        className="font-bold text-[#8B5A2B] hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </main>
    );
}

export default ProviderLogin;