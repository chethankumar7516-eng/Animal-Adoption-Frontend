import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">

                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-2xl shadow-lg shadow-orange-200">
                        🐾
                    </div>

                    <div>
                        <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                            PetConnect
                        </h1>

                        <p className="text-xs text-slate-500">
                            Find. Connect. Love.
                        </p>
                    </div>
                </Link>

                {/* Navigation */}
                <div className="hidden items-center gap-8 md:flex">

                    <Link
                        to="/"
                        className="text-sm font-medium text-slate-600 transition hover:text-orange-500"
                    >
                        Home
                    </Link>

                  

                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3">

                    <button
                        onClick={() => navigate("/user/login")}
                        className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/user/register")}
                        className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600"
                    >
                        Get Started
                    </button>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;