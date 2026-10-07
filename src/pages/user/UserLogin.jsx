import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";
import { PawPrint, Loader2, AlertCircle, ArrowLeft } from "lucide-react";

function UserLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await API.post("/users/login", form);

            // Store Token
            if (response.data?.token) {
                localStorage.setItem("userToken", response.data.token);
            }

            // Store User ID (adjust key depending on your backend response structure)
            const userId = response.data?.user?._id || response.data?.user?.id || response.data?.userId;
            if (userId) {
                localStorage.setItem("userId", userId);
            }

            navigate("/user/dashboard");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#FAF6F0] px-6 py-12 text-[#3D2314]">

            <div className="w-full max-w-md rounded-3xl border border-[#E6DCCF] bg-white p-8 shadow-sm sm:p-10">

                {/* LOGO & HEADER */}
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B5A2B] text-white shadow-md">
                        <PawPrint className="h-9 w-9 stroke-[2.5]" />
                    </div>

                    <h1 className="text-3xl font-black tracking-tight text-[#3D2314]">
                        Welcome Back
                    </h1>

                    <p className="mt-2 text-sm font-semibold text-[#A06C3F]">
                        Sign in to your PetConnect account
                    </p>
                </div>

                {/* ERROR MESSAGE */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3.5 text-sm font-medium text-rose-800">
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                        <p>{error}</p>
                    </div>
                )}

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#3D2314]">
                            Email Address
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            required
                            className="w-full rounded-xl border border-[#E6DCCF] bg-[#FAF6F0] px-4 py-3 text-[#3D2314] placeholder-[#A06C3F]/60 outline-none transition focus:border-[#8B5A2B] focus:bg-white focus:ring-4 focus:ring-[#8B5A2B]/10"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-bold text-[#3D2314]">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Your password"
                            required
                            className="w-full rounded-xl border border-[#E6DCCF] bg-[#FAF6F0] px-4 py-3 text-[#3D2314] placeholder-[#A06C3F]/60 outline-none transition focus:border-[#8B5A2B] focus:bg-white focus:ring-4 focus:ring-[#8B5A2B]/10"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full items-center justify-center rounded-xl bg-[#8B5A2B] px-5 py-3.5 font-bold text-white shadow-sm transition hover:bg-[#724820] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-5 w-5 animate-spin text-white" />
                                Signing In...
                            </span>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                </form>

                {/* FOOTER LINKS */}
                <div className="mt-8 space-y-4 text-center">
                    <p className="text-sm font-semibold text-[#724820]">
                        Don't have an account?{" "}
                        <Link
                            to="/user/register"
                            className="font-bold text-[#8B5A2B] hover:text-[#724820] underline decoration-[#8B5A2B]/30 underline-offset-4"
                        >
                            Register
                        </Link>
                    </p>

                    <div>
                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#A06C3F] transition hover:text-[#724820]"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Home
                        </Link>
                    </div>
                </div>

            </div>

        </main>
    );
}

export default UserLogin;