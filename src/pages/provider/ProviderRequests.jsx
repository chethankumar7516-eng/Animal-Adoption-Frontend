import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

function ProviderRequests() {

    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [updatingId, setUpdatingId] = useState(null);


    // ======================================================
    // GET PROVIDER REQUESTS
    // ======================================================

    const getRequests = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem(
                    "providerToken"
                );


            // ==========================================
            // CHECK TOKEN
            // ==========================================

            if (!token) {

                navigate(
                    "/provider/login",
                    {
                        replace: true
                    }
                );

                return;
            }


            console.log(
                "Getting provider adoption requests..."
            );


            // ==========================================
            // GET REQUESTS
            // ==========================================

            const response =
                await API.get(
                    "/service/provider-requests",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            console.log(
                "PROVIDER REQUEST RESPONSE:",
                response.data
            );


            // ==========================================
            // CHECK RESPONSE
            // ==========================================

            if (response.data?.success) {

                setRequests(
                    response.data.requests || []
                );

            } else {

                setError(
                    response.data?.message ||
                    "Unable to load adoption requests."
                );

            }

        } catch (error) {

            console.error(
                "Provider requests error:",
                error
            );


            console.error(
                "Server response:",
                error.response?.data
            );


            // ==========================================
            // UNAUTHORIZED
            // ==========================================

            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem(
                    "providerToken"
                );

                localStorage.removeItem(
                    "providerName"
                );

                navigate(
                    "/provider/login",
                    {
                        replace: true
                    }
                );

                return;
            }


            setError(
                error.response?.data?.message ||
                "Unable to load adoption requests."
            );

        } finally {

            setLoading(false);

        }
    };


    // ======================================================
    // LOAD REQUESTS
    // ======================================================

    useEffect(() => {

        getRequests();

    }, []);


    // ======================================================
    // UPDATE REQUEST STATUS
    // ======================================================

    const updateStatus = async (
        requestId,
        status
    ) => {

        try {

            const token =
                localStorage.getItem(
                    "providerToken"
                );


            if (!token) {

                navigate(
                    "/provider/login",
                    {
                        replace: true
                    }
                );

                return;
            }


            setUpdatingId(requestId);


            // ==========================================
            // UPDATE
            // ==========================================

            const response =
                await API.put(
                    `/service/request/${requestId}/status`,
                    {
                        status
                    },
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            console.log(
                "UPDATE REQUEST RESPONSE:",
                response.data
            );


            if (
                response.data?.success
            ) {
         
                // Update request locally
                setRequests(
                    (previousRequests) =>
                        previousRequests.map(
                            (request) =>
                                request._id ===
                                requestId
                                    ? {
                                        ...request,
                                        status
                                    }
                                    : request
                        )
                );

            } else {

                alert(
                    response.data?.message ||
                    "Unable to update request"
                );

            }

        } catch (error) {

            console.error(
                "Update request error:",
                error
            );


            alert(
                error.response?.data?.message ||
                "Unable to update request"
            );

        } finally {

            setUpdatingId(null);

        }
    };


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (

            <main className="min-h-screen bg-[#FAF6F0]">

                <header className="border-b border-[#E6DCCF] bg-white">

                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

                        <div>

                            <h1 className="text-xl font-black text-[#3D2314]">
                                🐾 PetConnect
                            </h1>

                            <p className="text-xs text-[#A06C3F]">
                                Provider Portal
                            </p>

                        </div>

                    </div>

                </header>


                <div className="flex min-h-[70vh] items-center justify-center">

                    <div className="text-center">

                        <div className="text-5xl">
                            🐾
                        </div>

                        <p className="mt-4 font-bold text-[#3D2314]">
                            Loading adoption requests...
                        </p>

                    </div>

                </div>

            </main>
        );
    }


    return (

        <main className="min-h-screen bg-[#FAF6F0]">

            {/* ==================================================
                HEADER
            ================================================== */}

            <header className="border-b border-[#E6DCCF] bg-white">

                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

                    <Link
                        to="/provider/dashboard"
                        className="flex items-center gap-3"
                    >

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B5A2B] text-2xl text-white">
                            🐾
                        </div>

                        <div>

                            <h1 className="font-black text-[#3D2314]">
                                PetConnect
                            </h1>

                            <p className="text-xs text-[#A06C3F]">
                                Provider Portal
                            </p>

                        </div>

                    </Link>


                    <div className="flex items-center gap-3">

                        <Link
                            to="/provider/dashboard"
                            className="rounded-xl border border-[#E6DCCF] px-5 py-2.5 text-sm font-semibold text-[#3D2314] transition hover:bg-[#FAF6F0]"
                        >
                            Dashboard
                        </Link>


                        <Link
                            to="/provider/pets"
                            className="rounded-xl bg-[#8B5A2B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#724820]"
                        >
                            My Pets
                        </Link>

                    </div>

                </div>

            </header>


            {/* ==================================================
                CONTENT
            ================================================== */}

            <section className="mx-auto max-w-5xl px-6 py-10">

                {/* TITLE */}

                <div className="mb-8">

                    <p className="text-sm font-bold tracking-wide text-[#A06C3F]">
                        ADOPTION MANAGEMENT
                    </p>

                    <h2 className="mt-2 text-4xl font-black text-[#3D2314]">
                        Adoption Requests
                    </h2>

                    <p className="mt-2 text-sm text-[#6E5D4F]">
                        Review requests from users who
                        want to adopt your pets.
                    </p>

                </div>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">

                        <p className="font-bold text-red-600">
                            ❌ {error}
                        </p>


                        <button
                            type="button"
                            onClick={getRequests}
                            className="mt-4 rounded-lg bg-red-500 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-600"
                        >
                            Try Again
                        </button>

                    </div>

                )}


                {/* ==================================================
                    NO REQUESTS
                ================================================== */}

                {!error &&
                    requests.length === 0 && (

                        <div className="rounded-2xl border border-[#E6DCCF] bg-white p-10 text-center shadow-sm">

                            <div className="text-5xl">
                                📭
                            </div>

                            <h3 className="mt-4 text-xl font-black text-[#3D2314]">
                                No Adoption Requests
                            </h3>

                            <p className="mt-2 text-sm text-[#6E5D4F]">
                                You don't have any adoption
                                requests yet.
                            </p>

                        </div>

                    )}


                {/* ==================================================
                    REQUEST LIST
                ================================================== */}

                <div className="space-y-6">

                    {requests.map(
                        (request) => {

                            const user =
                                request.userId;

                            const pet =
                                request.petId;


                            return (

                                <div
                                    key={request._id}
                                    className="rounded-2xl border border-[#E6DCCF] bg-white p-6 shadow-sm"
                                >

                                    {/* =================================
                                        TOP
                                    ================================= */}

                                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                                        {/* PET */}

                                        <div className="flex gap-5">

                                            {/* PET IMAGE */}

                                            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-[#FAF6F0] border border-[#E6DCCF]">

                                                {pet?.image ? (

                                                    <img
                                                        src={
                                                            pet.image
                                                        }
                                                        alt={
                                                            pet.name ||
                                                            "Pet"
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />

                                                ) : (

                                                    <div className="flex h-full w-full items-center justify-center text-4xl">
                                                        🐾
                                                    </div>

                                                )}

                                            </div>


                                            {/* PET INFO */}

                                            <div>

                                                <p className="text-xs font-bold uppercase tracking-wide text-[#A06C3F]">
                                                    Pet
                                                </p>

                                                <h3 className="mt-1 text-2xl font-black text-[#3D2314]">
                                                    {pet?.name ||
                                                        "Unknown Pet"}
                                                </h3>

                                                <p className="mt-2 text-sm text-[#6E5D4F]">

                                                    {pet?.type ||
                                                        "Pet"}

                                                    {pet?.breed &&
                                                        ` • ${pet.breed}`}

                                                </p>

                                                <p className="mt-1 text-sm text-[#6E5D4F]/80">

                                                    {pet?.age &&
                                                        `Age: ${pet.age}`}

                                                    {pet?.gender &&
                                                        ` • ${pet.gender}`}

                                                </p>

                                            </div>

                                        </div>


                                        {/* STATUS */}

                                        <div>

                                            <span
                                                className={`inline-flex rounded-full px-4 py-2 text-sm font-bold ${
                                                    request.status ===
                                                    "pending"
                                                        ? "bg-amber-100 text-amber-800"
                                                        : request.status ===
                                                          "accepted"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-rose-100 text-rose-800"
                                                }`}
                                            >

                                                {request.status
                                                    ?.charAt(
                                                        0
                                                    )
                                                    .toUpperCase() +
                                                    request.status?.slice(
                                                        1
                                                    )}

                                            </span>

                                        </div>

                                    </div>


                                    {/* =================================
                                        DIVIDER
                                    ================================= */}

                                    <div className="my-6 border-t border-[#E6DCCF]/60" />


                                    {/* =================================
                                        USER INFORMATION
                                    ================================= */}

                                    <div>

                                        <p className="text-xs font-bold uppercase tracking-wide text-[#A06C3F]">
                                            Applicant
                                        </p>

                                        <h4 className="mt-2 text-lg font-black text-[#3D2314]">
                                            {user?.name ||
                                                "Unknown User"}
                                        </h4>


                                        <div className="mt-3 grid gap-2 text-sm text-[#6E5D4F] sm:grid-cols-2">

                                            {user?.email && (

                                                <p>
                                                    📧{" "}
                                                    {user.email}
                                                </p>

                                            )}


                                            {user?.phone && (

                                                <p>
                                                    📞{" "}
                                                    {user.phone}
                                                </p>

                                            )}


                                            {user?.address && (

                                                <p className="sm:col-span-2">
                                                    📍{" "}
                                                    {user.address}
                                                </p>

                                            )}

                                        </div>

                                    </div>


                                    {/* =================================
                                        ACTIONS
                                    ================================= */}

                                    {request.status ===
                                        "pending" && (

                                        <div className="mt-6 flex flex-wrap gap-3">

                                            <button
                                                type="button"
                                                disabled={
                                                    updatingId ===
                                                    request._id
                                                }
                                                onClick={() =>
                                                    updateStatus(
                                                        request._id,
                                                        "accepted"
                                                    )
                                                }
                                                className="rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                {updatingId ===
                                                request._id
                                                    ? "Updating..."
                                                    : "✓ Accept"}

                                            </button>


                                            <button
                                                type="button"
                                                disabled={
                                                    updatingId ===
                                                    request._id
                                                }
                                                onClick={() =>
                                                    updateStatus(
                                                        request._id,
                                                        "rejected"
                                                    )
                                                }
                                                className="rounded-xl bg-rose-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                {updatingId ===
                                                request._id
                                                    ? "Updating..."
                                                    : "✕ Reject"}

                                            </button>

                                        </div>

                                    )}

                                </div>

                            );
                        }
                    )}

                </div>

            </section>

        </main>
    );
}

export default ProviderRequests;