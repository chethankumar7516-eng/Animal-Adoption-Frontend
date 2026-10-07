import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../../services/api";

function ProviderDashboard() {
    const navigate = useNavigate();

    const [providerName, setProviderName] = useState(
        localStorage.getItem("providerName") || "Provider"
    );

    const [loading, setLoading] = useState(true);
    const [petCount, setPetCount] = useState(0);

    // ======================================================
    // GET PROVIDER PROFILE & PETS COUNT
    // ======================================================

    useEffect(() => {
        const fetchUserRequests = async () => {
            try {
                const response = await API.get("/service/user-requests");
                console.log(response.data);
            } catch (err) {
                console.error("Error fetching user requests:", err);
            }
        };

        const getDashboardData = async () => {
            const token = localStorage.getItem("providerToken");

            if (!token) {
                navigate("/provider/login");
                return;
            }

            try {
                // 1. Fetch Profile first to guarantee provider ID
                const profileRes = await API.get("/providers/profile", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                let currentProviderId = localStorage.getItem("providerId");

                if (profileRes.data?.success && profileRes.data?.provider) {
                    const provider = profileRes.data.provider;

                    if (provider.name) {
                        setProviderName(provider.name);
                        localStorage.setItem("providerName", provider.name);
                    }

                    // Handle different possible provider ID field names
                    currentProviderId =
                        provider._id || provider.id || provider.providerId || currentProviderId;

                    if (currentProviderId) {
                        localStorage.setItem("providerId", currentProviderId);
                    }
                }

                // 2. Fetch pets using the resolved Provider ID
                if (currentProviderId) {
                    const petsRes = await API.get(
                        `/providers/getpetbyprovider/${currentProviderId}`,
                        {
                            headers: { Authorization: `Bearer ${token}` }
                        }
                    );

                    // Extract array from various possible API responses
                    const rawData = petsRes.data;
                    let petsArray = [];

                    if (Array.isArray(rawData)) {
                        petsArray = rawData;
                    } else if (Array.isArray(rawData?.pets)) {
                        petsArray = rawData.pets;
                    } else if (Array.isArray(rawData?.data)) {
                        petsArray = rawData.data;
                    } else if (Array.isArray(rawData?.getpet)) {
                        petsArray = rawData.getpet;
                    }

                    // Set state with calculated length or numeric count property
                    if (petsArray.length > 0) {
                        setPetCount(petsArray.length);
                    } else if (typeof rawData?.count === "number") {
                        setPetCount(rawData.count);
                    } else {
                        setPetCount(0);
                    }
                }

            } catch (error) {
                console.error("Dashboard data load error:", error);

                if (
                    error.response?.status === 401 ||
                    error.response?.status === 403
                ) {
                    localStorage.removeItem("providerToken");
                    localStorage.removeItem("providerName");
                    localStorage.removeItem("providerId");
                    navigate("/provider/login");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserRequests();
        getDashboardData();
    }, [navigate]);

    // ======================================================
    // LOGOUT
    // ======================================================

    const handleLogout = () => {
        localStorage.removeItem("providerToken");
        localStorage.removeItem("providerName");
        localStorage.removeItem("providerId");
        navigate("/provider/login");
    };

    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-[#FAF6F0]">
                <div className="text-center">
                    <svg className="mx-auto h-12 w-12 animate-pulse text-[#8B5A2B]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.5 1c-.83 0-1.5.67-1.5 1.5S7.67 14 8.5 14s1.5-.67 1.5-1.5S9.33 11 8.5 11zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM12 3a9 9 0 00-9 9c0 3.08 1.56 5.8 3.95 7.42l1.3-2.25C6.88 16.23 6 14.23 6 12a6 6 0 1112 0c0 2.23-.88 4.23-2.25 5.17l1.3 2.25C19.44 17.8 21 15.08 21 12a9 9 0 00-9-9z"/>
                    </svg>
                    <p className="mt-3 font-bold text-[#3D2314]">
                        Loading dashboard...
                    </p>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen w-full bg-[#FAF6F0]">

            {/* SIDEBAR */}
            <aside className="fixed left-0 top-0 z-50 hidden h-screen w-72 flex-col border-r border-[#E6DCCF] bg-white lg:flex">
                <div className="border-b border-[#E6DCCF] p-6">
                    <Link to="/provider/dashboard" className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#8B5A2B] text-white">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.5 1c-.83 0-1.5.67-1.5 1.5S7.67 14 8.5 14s1.5-.67 1.5-1.5S9.33 11 8.5 11zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-[#3D2314]">PetConnect</h1>
                            <p className="text-xs text-[#A06C3F]">Provider Portal</p>
                        </div>
                    </Link>
                </div>

                <div className="border-b border-[#E6DCCF] p-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF6F0] text-[#8B5A2B]">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#A06C3F]">Logged in as</p>
                            <p className="truncate text-base font-black text-[#3D2314]">
                                {providerName}
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 space-y-2 overflow-y-auto p-4">
                    <Link
                        to="/provider/dashboard"
                        className="flex items-center gap-4 rounded-xl bg-[#FAF6F0] px-4 py-3.5 font-bold text-[#8B5A2B]"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>

                    <Link
                        to="/provider/messages"
                        className="flex items-center gap-4 rounded-xl px-4 py-3.5 font-semibold text-[#6E5D4F] hover:bg-[#FAF6F0] hover:text-[#8B5A2B]"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Messages
                    </Link>

                    <Link
                        to="/provider/pets"
                        className="flex items-center gap-4 rounded-xl px-4 py-3.5 font-semibold text-[#6E5D4F] hover:bg-[#FAF6F0] hover:text-[#8B5A2B]"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Manage Pets
                    </Link>

                    <Link
                        to="/provider/pets/add"
                        className="flex items-center gap-4 rounded-xl px-4 py-3.5 font-semibold text-[#6E5D4F] hover:bg-[#FAF6F0] hover:text-[#8B5A2B]"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Pet
                    </Link>

                    <Link
                        to="/provider/pets"
                        className="flex items-center gap-4 rounded-xl px-4 py-3.5 font-semibold text-[#6E5D4F] hover:bg-[#FAF6F0] hover:text-[#8B5A2B]"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit Pet Details
                    </Link>

                    <Link
                        to="/provider/requests"
                        className="flex items-center gap-4 rounded-xl px-4 py-3.5 font-semibold text-[#6E5D4F] hover:bg-[#FAF6F0] hover:text-[#8B5A2B]"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Adoption Requests
                    </Link>
                </nav>

                <div className="border-t border-[#E6DCCF] p-4">
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-4 rounded-xl px-4 py-3.5 font-bold text-red-600 hover:bg-red-50"
                    >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </aside>

            {/* MOBILE HEADER */}
            <header className="sticky top-0 z-40 border-b border-[#E6DCCF] bg-white lg:hidden">
                <div className="flex items-center justify-between px-5 py-4">
                    <Link to="/provider/dashboard" className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5A2B] text-white">
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.5 1c-.83 0-1.5.67-1.5 1.5S7.67 14 8.5 14s1.5-.67 1.5-1.5S9.33 11 8.5 11zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="font-black text-[#3D2314]">PetConnect</h1>
                            <p className="text-[10px] text-[#A06C3F]">Provider Portal</p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm font-bold text-[#3D2314] sm:block">
                            {providerName}
                        </span>
                        <Link
                            to="/provider/messages"
                            className="flex items-center gap-2 rounded-lg border border-[#E6DCCF] bg-white px-3 py-2 text-sm font-bold text-[#8B5A2B]"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Messages
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="flex items-center gap-2 rounded-lg bg-[#8B5A2B] px-4 py-2 text-sm font-bold text-white"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <section className="w-full lg:ml-72 lg:w-[calc(100%-18rem)]">
                <div className="px-6 py-10 lg:px-10 xl:px-14">

                    {/* WELCOME */}
                    <div className="mb-10">
                        <p className="text-sm font-bold tracking-wider text-[#A06C3F]">
                            PROVIDER DASHBOARD
                        </p>
                        <h2 className="mt-3 text-4xl font-black text-[#3D2314] lg:text-5xl">
                            Welcome, {providerName}
                        </h2>
                        <p className="mt-3 text-base text-[#6E5D4F]">
                            Manage your pets and adoption requests from one place.
                        </p>
                    </div>

                    {/* STAT CARDS */}
                    <div className="mb-10">
                        <Link
                            to="/provider/pets"
                            className="block max-w-sm rounded-2xl border border-[#E6DCCF] bg-white p-6 shadow-sm hover:-translate-y-1 hover:shadow-lg transition"
                        >
                            <p className="text-sm font-semibold text-[#6E5D4F]">Listed Pets</p>
                            <p className="mt-2 text-3xl font-black text-[#3D2314]">
                                {petCount}
                            </p>
                        </Link>
                    </div>

                    {/* QUICK ACTIONS */}
                    <div>
                        <p className="text-sm font-bold tracking-wider text-[#A06C3F]">
                            QUICK ACTIONS
                        </p>
                        <h3 className="mb-6 mt-2 text-2xl font-black text-[#3D2314]">
                            Manage Your Pets & Messages
                        </h3>

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <Link
                                to="/provider/messages"
                                className="rounded-2xl border border-[#E6DCCF] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="mb-5 text-[#8B5A2B]">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-[#3D2314]">Messages</h3>
                                <p className="mt-2 text-sm leading-6 text-[#6E5D4F]">
                                    Chat with interested users and respond to inquiries.
                                </p>
                            </Link>

                            <Link
                                to="/provider/pets/add"
                                className="rounded-2xl border border-[#E6DCCF] bg-[#FAF6F0] p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="mb-5 text-[#8B5A2B]">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-[#3D2314]">Add Pet</h3>
                                <p className="mt-2 text-sm leading-6 text-[#6E5D4F]">
                                    Add a new pet and make it available for adoption.
                                </p>
                            </Link>

                            <Link
                                to="/provider/pets"
                                className="rounded-2xl border border-[#E6DCCF] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="mb-5 text-[#8B5A2B]">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-[#3D2314]">Manage Pets</h3>
                                <p className="mt-2 text-sm leading-6 text-[#6E5D4F]">
                                    View and manage all pets you have listed.
                                </p>
                            </Link>

                            <Link
                                to="/provider/pets"
                                className="rounded-2xl border border-[#E6DCCF] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                            >
                                <div className="mb-5 text-[#8B5A2B]">
                                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-[#3D2314]">Edit Pet Details</h3>
                                <p className="mt-2 text-sm leading-6 text-[#6E5D4F]">
                                    Update pet information, images, status, and other details.
                                </p>
                            </Link>
                        </div>
                    </div>

                </div>
            </section>

        </main>
    );
}

export default ProviderDashboard;