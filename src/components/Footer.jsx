import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="bg-slate-950 text-white">

            <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">

                <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div className="lg:col-span-2">

                        <Link
                            to="/"
                            className="flex items-center gap-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-2xl">
                                🐾
                            </div>

                            <div>
                                <h2 className="text-xl font-bold">
                                    PetConnect
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Find. Connect. Love.
                                </p>
                            </div>
                        </Link>

                        <p className="mt-6 max-w-md leading-7 text-slate-400">
                            PetConnect makes it easier for loving families
                            to discover pets and connect with trusted
                            providers. Every pet deserves a happy home.
                        </p>

                    </div>

                    {/* Platform */}
                    <div>
                        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider">
                            Platform
                        </h3>

                        <div className="space-y-3">

                            <Link
                                to="/"
                                className="block text-sm text-slate-400 hover:text-orange-400"
                            >
                                Home
                            </Link>

                            <Link
                                to="/user/register"
                                className="block text-sm text-slate-400 hover:text-orange-400"
                            >
                                Find a Pet
                            </Link>

                            <Link
                                to="/user/login"
                                className="block text-sm text-slate-400 hover:text-orange-400"
                            >
                                User Login
                            </Link>

                            <Link
                                to="/provider/login"
                                className="block text-sm text-slate-400 hover:text-orange-400"
                            >
                                Provider Login
                            </Link>

                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider">
                            Contact
                        </h3>

                        <div className="space-y-4 text-sm text-slate-400">

                            <p>📧 support@petconnect.com</p>

                            <p>📞 +91 98765 43210</p>

                            <p>📍 India</p>

                        </div>
                    </div>

                </div>

                <div className="mt-14 border-t border-slate-800 pt-8">

                    <p className="text-center text-sm text-slate-500">
                        © 2026 PetConnect. All rights reserved.
                    </p>

                </div>

            </div>

        </footer>
    );
}

export default Footer;