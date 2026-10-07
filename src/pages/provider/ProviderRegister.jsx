import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

function ProviderRegister() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
    });

    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setErrors({});
        setLoading(true);

        try {
            const response = await API.post("/providers/register", {
                name: form.name.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                phone: form.phone.trim(),
                address: form.address.trim(),
            });

            console.log("PROVIDER REGISTER RESPONSE:", response.data);

            if (!response.data?.success) {
                setError(
                    response.data?.message ||
                    "Unable to create provider account."
                );
                return;
            }

            setSuccess(
                response.data?.message ||
                "Provider account created successfully."
            );

            setForm({
                name: "",
                email: "",
                password: "",
                phone: "",
                address: "",
            });

            setTimeout(() => {
                navigate("/provider/login", {
                    replace: true,
                });
            }, 1200);
        } catch (err) {
            console.error("Provider registration error:", err);

            const message = err.response?.data?.message;

            if (Array.isArray(message)) {
                const fieldErrors = {};

                message.forEach((item) => {
                    if (item.path) {
                        fieldErrors[item.path] = item.msg;
                    }
                });

                setErrors(fieldErrors);
            } else {
                setError(
                    message ||
                    "Unable to create provider account."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF6F0]">
            <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">

                {/* LEFT */}
                <div className="hidden bg-[#8B5A2B] p-12 lg:flex lg:flex-col lg:justify-between">
                    <Link
                        to="/"
                        className="flex items-center gap-3 text-white"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-white">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.5 1c-.83 0-1.5.67-1.5 1.5S7.67 14 8.5 14s1.5-.67 1.5-1.5S9.33 11 8.5 11zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                            </svg>
                        </div>

                        <div>
                            <h1 className="text-xl font-black">
                                PetConnect
                            </h1>

                            <p className="text-sm text-[#FAF6F0]/80">
                                Find. Connect. Love.
                            </p>
                        </div>
                    </Link>

                    <div className="max-w-lg">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-white">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                        </div>

                        <h2 className="text-5xl font-black leading-tight text-white">
                            Help pets find their perfect family.
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-[#FAF6F0]/90">
                            Join PetConnect as a provider and connect
                            with people looking for their next companion.
                        </p>
                    </div>

                    <p className="text-sm text-[#FAF6F0]/70">
                        © 2026 PetConnect
                    </p>
                </div>

                {/* RIGHT */}
                <div className="flex items-center justify-center px-6 py-12">
                    <div className="w-full max-w-lg">

                        {/* MOBILE LOGO */}
                        <Link
                            to="/"
                            className="mb-8 flex items-center gap-3 lg:hidden"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8B5A2B] text-white">
                                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.5 1c-.83 0-1.5.67-1.5 1.5S7.67 14 8.5 14s1.5-.67 1.5-1.5S9.33 11 8.5 11zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                                </svg>
                            </div>

                            <div>
                                <h1 className="font-black text-[#3D2314]">
                                    PetConnect
                                </h1>

                                <p className="text-xs text-[#6E5D4F]">
                                    Find. Connect. Love.
                                </p>
                            </div>
                        </Link>

                        {/* HEADING */}
                        <div className="mb-8">
                            <p className="font-bold text-[#A06C3F]">
                                PROVIDER REGISTRATION
                            </p>

                            <h1 className="mt-2 text-4xl font-black text-[#3D2314]">
                                Create your account
                            </h1>

                            <p className="mt-3 text-[#6E5D4F]">
                                Register as a provider to start connecting
                                with potential pet adopters.
                            </p>
                        </div>

                        {/* ERROR */}
                        {error && (
                            <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* SUCCESS */}
                        {success && (
                            <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                                <svg className="h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>{success}</span>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* NAME */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-semibold text-[#3D2314]"
                                >
                                    Provider Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your name"
                                    required
                                    disabled={loading}
                                    className="w-full rounded-xl border border-[#E6DCCF] bg-white px-4 py-3.5 outline-none focus:border-[#8B5A2B] focus:ring-4 focus:ring-[#8B5A2B]/10 disabled:bg-gray-100"
                                />

                                {errors.name && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label
                                    htmlFor="email"
                                    className="mb-2 block text-sm font-semibold text-[#3D2314]"
                                >
                                    Email Address
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    required
                                    disabled={loading}
                                    className="w-full rounded-xl border border-[#E6DCCF] bg-white px-4 py-3.5 outline-none focus:border-[#8B5A2B] focus:ring-4 focus:ring-[#8B5A2B]/10 disabled:bg-gray-100"
                                />

                                {errors.email && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* PHONE */}
                            <div>
                                <label
                                    htmlFor="phone"
                                    className="mb-2 block text-sm font-semibold text-[#3D2314]"
                                >
                                    Phone Number
                                </label>

                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    disabled={loading}
                                    className="w-full rounded-xl border border-[#E6DCCF] bg-white px-4 py-3.5 outline-none focus:border-[#8B5A2B] focus:ring-4 focus:ring-[#8B5A2B]/10 disabled:bg-gray-100"
                                />

                                {errors.phone && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            {/* ADDRESS */}
                            <div>
                                <label
                                    htmlFor="address"
                                    className="mb-2 block text-sm font-semibold text-[#3D2314]"
                                >
                                    Address
                                </label>

                                <textarea
                                    id="address"
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Your address"
                                    disabled={loading}
                                    className="w-full resize-none rounded-xl border border-[#E6DCCF] bg-white px-4 py-3.5 outline-none focus:border-[#8B5A2B] focus:ring-4 focus:ring-[#8B5A2B]/10 disabled:bg-gray-100"
                                />

                                {errors.address && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* PASSWORD */}
                            <div>
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-semibold text-[#3D2314]"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    minLength={6}
                                    autoComplete="new-password"
                                    required
                                    disabled={loading}
                                    className="w-full rounded-xl border border-[#E6DCCF] bg-white px-4 py-3.5 outline-none focus:border-[#8B5A2B] focus:ring-4 focus:ring-[#8B5A2B]/10 disabled:bg-gray-100"
                                />

                                {errors.password && (
                                    <p className="mt-1.5 text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B5A2B] px-6 py-4 font-bold text-white shadow-lg transition hover:bg-[#724820] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <svg className="h-5 w-5 animate-spin text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                        <span>Creating Account...</span>
                                    </>
                                ) : (
                                    <span>Create Provider Account</span>
                                )}
                            </button>
                        </form>

                        {/* LOGIN */}
                        <div className="mt-8 text-center">
                            <p className="text-sm text-[#6E5D4F]">
                                Already have a provider account?
                            </p>

                            <Link
                                to="/provider/login"
                                className="mt-2 inline-flex items-center gap-1 font-bold text-[#8B5A2B] hover:text-[#724820]"
                            >
                                <span>Sign In</span>
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default ProviderRegister;