import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { PawPrint, Dog, Loader2 } from "lucide-react";

function UserRegister() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const [errors, setErrors] = useState({});
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value,
        }));

        // Remove error for this field while typing
        setErrors((previousErrors) => ({
            ...previousErrors,
            [name]: "",
        }));

        setError("");
    };

    // =========================
    // HANDLE REGISTER
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setErrors({});
        setSuccess("");
        setLoading(true);

        try {
            const response = await API.post(
                "/users/register",
                form
            );

            // =========================
            // BACKEND VALIDATION ERROR
            // =========================

            if (response.data?.success === false) {
                const responseMessage =
                    response.data?.message;

                if (Array.isArray(responseMessage)) {
                    const fieldErrors = {};

                    responseMessage.forEach((item) => {
                        if (item.path) {
                            fieldErrors[item.path] = item.msg;
                        }
                    });

                    setErrors(fieldErrors);
                } else {
                    setError(
                        responseMessage ||
                        "Unable to create account."
                    );
                }

                return;
            }

            // =========================
            // SUCCESS
            // =========================

            setSuccess(
                response.data?.message ||
                "Account created successfully."
            );

            setForm({
                name: "",
                email: "",
                password: "",
                phone: "",
            });

            setTimeout(() => {
                navigate("/user/login");
            }, 1200);

        } catch (err) {
            const responseMessage =
                err.response?.data?.message;

            // =========================
            // EXPRESS VALIDATOR ERRORS
            // =========================

            if (Array.isArray(responseMessage)) {
                const fieldErrors = {};

                responseMessage.forEach((item) => {
                    if (item.path) {
                        fieldErrors[item.path] = item.msg;
                    }
                });

                setErrors(fieldErrors);
            } else {
                setError(
                    responseMessage ||
                    "Unable to create account."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#FAF6F0]">

            <div className="mx-auto grid min-h-screen max-w-7xl lg:grid-cols-2">

                {/* =========================================
                    LEFT SIDE
                ========================================== */}

                <div className="hidden bg-gradient-to-br from-[#8B5A2B] to-[#724820] p-12 lg:flex lg:flex-col lg:justify-between">

                    {/* Logo */}

                    <Link
                        to="/"
                        className="flex items-center gap-3 text-white"
                    >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                            <PawPrint className="h-6 w-6 text-white stroke-[2.5]" />
                        </div>

                        <div>
                            <h1 className="text-xl font-black">
                                PetConnect
                            </h1>

                            <p className="text-sm text-[#E6DCCF]">
                                Find. Connect. Love.
                            </p>
                        </div>
                    </Link>

                    {/* Main Text */}

                    <div className="max-w-lg">

                        <div className="mb-6">
                            <Dog className="h-24 w-24 text-white/90 stroke-[1.25]" />
                        </div>

                        <h2 className="text-5xl font-black leading-tight text-white">
                            Find your new best friend.
                        </h2>

                        <p className="mt-6 text-lg leading-8 text-[#E6DCCF]">
                            Create your PetConnect account and discover
                            pets waiting for a loving home.
                        </p>

                    </div>

                    {/* Footer */}

                    <p className="text-sm text-[#E6DCCF]">
                        © 2026 PetConnect
                    </p>

                </div>

                {/* =========================================
                    RIGHT SIDE
                ========================================== */}

                <div className="flex items-center justify-center px-6 py-12">

                    <div className="w-full max-w-lg">

                        {/* =================================
                            MOBILE LOGO
                        ================================= */}

                        <Link
                            to="/"
                            className="mb-8 flex items-center gap-3 lg:hidden"
                        >

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8B5A2B] text-white">
                                <PawPrint className="h-6 w-6 stroke-[2.5]" />
                            </div>

                            <div>

                                <h1 className="font-black text-[#3D2314]">
                                    PetConnect
                                </h1>

                                <p className="text-xs text-[#A06C3F]">
                                    Find. Connect. Love.
                                </p>

                            </div>

                        </Link>

                        {/* =================================
                            HEADING
                        ================================= */}

                        <div className="mb-8">

                            <p className="font-bold text-[#A06C3F]">
                                CREATE ACCOUNT
                            </p>

                            <h1 className="mt-2 text-4xl font-black text-[#3D2314]">
                                Join PetConnect
                            </h1>

                            <p className="mt-3 text-[#6E5D4F]">
                                Create an account to find and connect
                                with pets and providers.
                            </p>

                        </div>

                        {/* =================================
                            GENERAL ERROR
                        ================================= */}

                        {error && (
                            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                                {error}
                            </div>
                        )}

                        {/* =================================
                            SUCCESS
                        ================================= */}

                        {success && (
                            <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-600">
                                {success}
                            </div>
                        )}

                        {/* =================================
                            FORM
                        ================================= */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >

                            {/* =================================
                                NAME
                            ================================= */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className={`w-full rounded-xl border bg-white px-4 py-3.5 outline-none transition focus:ring-4 ${
                                        errors.name
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-[#E6DCCF] focus:border-[#8B5A2B] focus:ring-[#8B5A2B]/10"
                                    }`}
                                />

                                {errors.name && (
                                    <p className="mt-1.5 text-sm font-medium text-red-500">
                                        {errors.name}
                                    </p>
                                )}

                            </div>

                            {/* =================================
                                EMAIL
                            ================================= */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className={`w-full rounded-xl border bg-white px-4 py-3.5 outline-none transition focus:ring-4 ${
                                        errors.email
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-[#E6DCCF] focus:border-[#8B5A2B] focus:ring-[#8B5A2B]/10"
                                    }`}
                                />

                                {errors.email && (
                                    <p className="mt-1.5 text-sm font-medium text-red-500">
                                        {errors.email}
                                    </p>
                                )}

                            </div>

                            {/* =================================
                                PHONE
                            ================================= */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    className={`w-full rounded-xl border bg-white px-4 py-3.5 outline-none transition focus:ring-4 ${
                                        errors.phone
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-[#E6DCCF] focus:border-[#8B5A2B] focus:ring-[#8B5A2B]/10"
                                    }`}
                                />

                                {errors.phone && (
                                    <p className="mt-1.5 text-sm font-medium text-red-500">
                                        {errors.phone}
                                    </p>
                                )}

                            </div>

                            {/* =================================
                                PASSWORD
                            ================================= */}

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                    className={`w-full rounded-xl border bg-white px-4 py-3.5 outline-none transition focus:ring-4 ${
                                        errors.password
                                            ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                                            : "border-[#E6DCCF] focus:border-[#8B5A2B] focus:ring-[#8B5A2B]/10"
                                    }`}
                                />

                                {errors.password && (
                                    <p className="mt-1.5 text-sm font-medium text-red-500">
                                        {errors.password}
                                    </p>
                                )}

                            </div>

                            {/* =================================
                                REGISTER BUTTON
                            ================================= */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#8B5A2B] px-6 py-4 font-bold text-white shadow-lg shadow-[#8B5A2B]/20 transition hover:bg-[#724820] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account"
                                )}
                            </button>

                        </form>

                        {/* =================================
                            LOGIN LINK
                        ================================= */}

                        <div className="mt-8 text-center">

                            <p className="text-sm text-[#6E5D4F]">
                                Already have an account?
                            </p>

                            <Link
                                to="/user/login"
                                className="mt-2 inline-block font-bold text-[#8B5A2B] hover:text-[#724820]"
                            >
                                Sign In →
                            </Link>

                        </div>

                    </div>

                </div>

            </div>

        </main>
    );
}

export default UserRegister;