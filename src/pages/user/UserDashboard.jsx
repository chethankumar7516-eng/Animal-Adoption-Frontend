import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../services/api";

import {
    PawPrint,
    Compass,
    ArrowRight,
    Filter,
    Dog,
    Cat,
    Bird,
    Loader2,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Hourglass,
    PartyPopper,
    X
} from "lucide-react";

function UserDashboard() {
    const navigate = useNavigate();

    const [pets, setPets] = useState([]);
      const [length, setLength] = useState([]);
    const [selectedType, setSelectedType] = useState("All");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [failedImages, setFailedImages] = useState({});

    // ======================================================
    // ADOPTION REQUEST STATES & MAP
    // ======================================================
    const [requestLoading, setRequestLoading] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");
    const [requestError, setRequestError] = useState("");

    // Maps petId -> "pending" | "accepted" | "rejected"
    const [requestStatuses, setRequestStatuses] = useState({});

    // ======================================================
    // FETCH USER EXISTING ADOPTION REQUESTS
    // ======================================================
    const fetchUserRequests = async () => {
        try {
            const response = await API.get("/service/user-requests");
            console.log(response.data);
            if (response.data?.success && response.data?.requests) {
                const statusMap = {};

                response.data.requests.forEach((req) => {
                    const petId =
                        typeof req.petId === "object"
                            ? req.petId?._id
                            : req.petId;
                    if (petId) {
                        statusMap[petId] = req.status;
                    }
                });
                setRequestStatuses(statusMap);
            }
        } catch (err) {
            console.error("Error fetching user requests:", err);
        }
    };

    // ======================================================
    // GET ALL PETS
    // ======================================================
    const fetchPets = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await API.get("/pets");
            setPets(response.data?.pets || []);
        } catch (err) {
            console.error("Get pets error:", err);
            setError(
                err.response?.data?.message || "Unable to load pets."
            );
        } finally {
            setLoading(false);
        }
    };
     const fetchLength = async () => {
        try {
      
            const response = await API.get("/pets/petlength");
            setLength(response.data.data);
        } catch (err) {
            console.error("Get pets error:", err);
         
        }
    };

    useEffect(() => {
        fetchPets();
        fetchUserRequests();
        fetchLength();
    }, []);

    // Filter pets based on selected dropdown type
    const filteredPets =
        selectedType === "All"
            ? pets
            : pets.filter(
                  (pet) =>
                      pet.type?.toLowerCase() === selectedType.toLowerCase()
              );

    // ======================================================
    // SEND ADOPTION REQUEST
    // ======================================================
    const sendAdoptionRequest = async (pet) => {
        try {
           
            setRequestLoading(pet._id);
            setRequestMessage("");
            setRequestError("");

            const providerId = pet.provider?._id || pet.providerId;

            if (!providerId) {
                setRequestError("Provider information is missing for this pet.");
                setRequestLoading(null);
                return;
            }

            const response = await API.post("/service/sendrequest", {
                petId: pet._id,
                providerId: providerId,
            });

            if (response.data?.success) {
                setRequestMessage(
                    `${pet.name}: ${
                        response.data.message ||
                        "Adoption request sent successfully."
                    }`
                );

                // Dynamically update status for this pet
                setRequestStatuses((prev) => ({
                    ...prev,
                    [pet._id]: "pending",
                }));
            } else {
                setRequestError(
                    response.data?.message || "Unable to send adoption request."
                );
            }
        } catch (err) {
            console.error("Send adoption request error:", err);

            if (err.response?.data?.status) {
                setRequestStatuses((prev) => ({
                    ...prev,
                    [pet._id]: err.response.data.status,
                }));
            }

            setRequestError(
                err.response?.data?.message || "Unable to send adoption request."
            );
        } finally {
            setRequestLoading(null);
        }
    };

    const clearRequestMessage = () => setRequestMessage("");
    const clearRequestError = () => setRequestError("");

    const handleLogout = () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userId");
        navigate("/user/login");
    };

    const getPetIcon = (type) => {
        switch (type) {
            case "Cat":
                return <Cat className="h-16 w-16 text-[#8B5A2B] stroke-[1.5]" />;
            case "Bird":
                return <Bird className="h-16 w-16 text-[#8B5A2B] stroke-[1.5]" />;
            case "Dog":
                return <Dog className="h-16 w-16 text-[#8B5A2B] stroke-[1.5]" />;
            default:
                return <PawPrint className="h-16 w-16 text-[#8B5A2B] stroke-[1.5]" />;
        }
    };

    const handleImageError = (petId) => {
        setFailedImages((prev) => ({
            ...prev,
            [petId]: true,
        }));
    };

    // ======================================================
    // RENDER ACTION BUTTON DEPENDING ON STATUS
    // ======================================================
    const renderActionButton = (pet) => {
        const isRequesting = requestLoading === pet._id;
        const currentStatus = requestStatuses[pet._id];

        // 1. Accepted state or Pet already adopted -> render disabled "Already Adopted" button
        if (currentStatus === "accepted" || pet.status === "Adopted") {
            return (
                <button
                    disabled
                    className="w-full rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-bold text-slate-500 cursor-not-allowed"
                >
                    Already Adopted
                </button>
            );
        }

        // 2. Requesting state
        if (isRequesting) {
            return (
                <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#A06C3F] px-4 py-2.5 text-sm font-bold text-white cursor-not-allowed opacity-75"
                >
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                </button>
            );
        }

        // 3. Pending state
        if (currentStatus === "pending") {
            return (
                <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white cursor-not-allowed"
                >
                    <Hourglass className="h-4 w-4 animate-pulse" />
                    Request Pending
                </button>
            );
        }

        // 4. Rejected state
        if (currentStatus === "rejected") {
            return (
                <button
                    disabled
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-bold text-white cursor-not-allowed"
                >
                    <XCircle className="h-4 w-4" />
                    Request Rejected
                </button>
            );
        }

        // 5. Default Request button
        return (
            <button
                type="button"
                onClick={() => sendAdoptionRequest(pet)}
                className="w-full rounded-xl bg-[#8B5A2B] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#724820]"
            >
                Request Adoption
            </button>
        );
    };

    return (
        <main className="min-h-screen w-full bg-[#FAF6F0] text-[#3D2314]">
            {/* HEADER */}
            <header className="w-full border-b border-[#E6DCCF] bg-white">
                <div className="flex w-full items-center justify-between px-6 py-5 lg:px-12 xl:px-16">
                    <Link
                        to="/"
                        className="flex items-center gap-3 transition hover:opacity-90"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B5A2B] text-2xl text-white shadow-md">
                            <PawPrint className="h-6 w-6 stroke-[2.5]" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight text-[#3D2314]">
                                PetConnect
                            </h1>
                            <p className="text-xs font-semibold text-[#A06C3F]">
                                User Portal
                            </p>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            to="/user/pets"
                            className="rounded-xl px-3 py-2 text-sm font-semibold text-[#724820] transition hover:bg-[#F3ECE0] sm:px-4 sm:text-base"
                        >
                            Browse Pets
                        </Link>
                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-xl bg-[#8B5A2B] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#724820] sm:text-base"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* DASHBOARD BODY */}
            <section className="w-full px-6 py-10 lg:px-12 xl:px-16">
                {/* MESSAGES */}
                {requestMessage && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-emerald-300 bg-emerald-50 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            <p className="font-semibold text-emerald-800">
                                {requestMessage}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={clearRequestMessage}
                            className="font-bold text-emerald-700 hover:text-emerald-900"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {requestError && (
                    <div className="mb-6 flex items-center justify-between rounded-xl border border-rose-300 bg-rose-50 px-5 py-4">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-rose-600" />
                            <p className="font-semibold text-rose-800">
                                {requestError}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={clearRequestError}
                            className="font-bold text-rose-700 hover:text-rose-900"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* WELCOME */}
                <div className="mb-8 sm:mb-10">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#A06C3F]">
                        USER DASHBOARD
                    </p>
                    <h2 className="mt-2 flex items-center gap-3 text-3xl font-black text-[#3D2314] sm:text-4xl">
                        Welcome to PetConnect
                        <PawPrint className="inline h-8 w-8 text-[#8B5A2B]" />
                    </h2>
                    <p className="mt-3 max-w-2xl text-sm text-[#724820] sm:text-base">
                        Discover pets from registered providers, choose a pet you
                        love, and connect directly with the provider.
                    </p>
                </div>

                {/* STATS & FILTERS */}
                <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {/* AVAILABLE PETS */}
                    <Link
                        to="/user/pets"
                        className="group rounded-2xl border border-[#E6DCCF] bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#A06C3F]">
                                    Available Pets
                                </p>
                                <p className="mt-2 text-3xl font-black text-[#3D2314]">
                                    {loading ? "..." : length}
                                </p>
                            </div>
                            <div className="rounded-xl bg-[#FAF6F0] p-3 text-[#8B5A2B] transition group-hover:bg-[#8B5A2B] group-hover:text-white">
                                <PawPrint className="h-7 w-7" />
                            </div>
                        </div>
                    </Link>

                    {/* SELECT BY TYPE DROPDOWN */}
                    <div className="rounded-2xl border border-[#E6DCCF] bg-white p-6">
                        <div className="flex items-center justify-between">
                            <div className="mr-3 w-full">
                                <label className="mb-1 block text-sm font-semibold text-[#A06C3F]">
                                    Filter by Type
                                </label>
                                <select
                                    value={selectedType}
                                    onChange={(e) =>
                                        setSelectedType(e.target.value)
                                    }
                                    className="w-full cursor-pointer rounded-xl border border-[#E6DCCF] bg-[#FAF6F0] px-3 py-1.5 font-bold text-[#3D2314] focus:outline-none focus:ring-2 focus:ring-[#8B5A2B]"
                                >
                                    <option value="All">All Types</option>
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Bird">Bird</option>
                                </select>
                            </div>
                            <div className="rounded-xl bg-[#FAF6F0] p-3 text-[#8B5A2B]">
                                <Filter className="h-7 w-7" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACTION CARDS */}
                <div className="mb-10">
                    <Link
                        to="/user/pets"
                        className="group flex flex-col md:flex-row md:items-center justify-between rounded-2xl border border-[#E6DCCF] bg-white p-7 transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="flex items-center gap-5">
                            <div className="inline-block rounded-2xl bg-[#FAF6F0] p-4 text-[#8B5A2B] transition group-hover:bg-[#8B5A2B] group-hover:text-white">
                                <Compass className="h-8 w-8" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-[#3D2314]">
                                    Browse Available Pets
                                </h3>
                                <p className="mt-1 leading-6 text-[#724820]">
                                    Explore pets added by registered providers and find your perfect companion.
                                </p>
                            </div>
                        </div>
                        <span className="mt-4 md:mt-0 inline-flex items-center gap-1.5 font-bold text-[#8B5A2B] group-hover:text-[#724820]">
                            Browse Pets{" "}
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                    </Link>
                </div>

                {/* PET SECTION */}
                <div>
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-[#A06C3F]">
                                FIND A FRIEND
                            </p>
                            <h3 className="mt-1 text-2xl font-black text-[#3D2314]">
                                {selectedType === "All"
                                    ? "Available Pets"
                                    : `${selectedType}s`}
                            </h3>
                        </div>

                        <Link
                            to="/user/pets"
                            className="inline-flex items-center gap-1 font-bold text-[#8B5A2B] hover:text-[#724820]"
                        >
                            View All <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>

                    {loading && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E6DCCF] bg-white p-10 text-center">
                            <Loader2 className="mb-2 h-8 w-8 animate-spin text-[#8B5A2B]" />
                            <p className="font-semibold text-[#724820]">
                                Loading pets...
                            </p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="rounded-2xl border border-rose-300 bg-rose-50 p-6">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-rose-600" />
                                <p className="font-semibold text-rose-800">
                                    {error}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={fetchPets}
                                className="mt-4 rounded-xl bg-[#8B5A2B] px-5 py-2 font-bold text-white transition hover:bg-[#724820]"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {!loading && !error && filteredPets.length === 0 && (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#E6DCCF] bg-white p-12 text-center">
                            <div className="mb-3 rounded-2xl bg-[#FAF6F0] p-5 text-[#8B5A2B]">
                                <PawPrint className="h-10 w-10" />
                            </div>
                            <h4 className="text-2xl font-black text-[#3D2314]">
                                No pets found
                            </h4>
                            <p className="mt-2 text-[#724820]">
                                No pets available for the selected category:{" "}
                                {selectedType}.
                            </p>
                        </div>
                    )}

                    {!loading && !error && filteredPets.length > 0 && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredPets.slice(0, 6).map((pet) => {
                                const hasImageFailed = failedImages[pet._id];
                                const showImage =
                                    pet.image && !hasImageFailed;
                                const status = requestStatuses[pet._id];
                                const isAdopted = pet.status === "Adopted" || status === "accepted";

                                return (
                                    <div
                                        key={pet._id}
                                        className="overflow-hidden rounded-2xl border border-[#E6DCCF] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="flex h-52 items-center justify-center overflow-hidden bg-[#FAF6F0]">
                                            {showImage ? (
                                                <img
                                                    src={`https://res.cloudinary.com/vfhlzi8w/image/upload/${pet.image}`}
                                                    alt={pet.name}
                                                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                                    onError={() =>
                                                        handleImageError(
                                                            pet._id
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center">
                                                    {getPetIcon(pet.type)}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6">
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <h4 className="text-xl font-black text-[#3D2314]">
                                                        {pet.name}
                                                    </h4>
                                                    <p className="mt-1 text-sm font-bold text-[#8B5A2B]">
                                                        {pet.type}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`rounded-full border px-3 py-1 text-xs font-bold ${
                                                        isAdopted
                                                            ? "border-rose-200 bg-rose-100 text-rose-800"
                                                            : "border-emerald-200 bg-emerald-100 text-emerald-800"
                                                    }`}
                                                >
                                                    {isAdopted ? "Adopted" : (pet.status || "Available")}
                                                </span>
                                            </div>

                                            <div className="mt-4 space-y-1 text-sm text-[#724820]">
                                                {pet.breed && (
                                                    <p>
                                                        <strong className="text-[#3D2314]">
                                                            Breed:
                                                        </strong>{" "}
                                                        {pet.breed}
                                                    </p>
                                                )}
                                                <p>
                                                    <strong className="text-[#3D2314]">
                                                        Age:
                                                    </strong>{" "}
                                                    {pet.age} years
                                                </p>
                                                <p>
                                                    <strong className="text-[#3D2314]">
                                                        Gender:
                                                    </strong>{" "}
                                                    {pet.gender}
                                                </p>
                                            </div>

                                            {pet.description && (
                                                <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#724820]">
                                                    {pet.description}
                                                </p>
                                            )}

                                            {pet.provider && (
                                                <div className="mt-4 rounded-xl border border-[#E6DCCF] bg-[#FAF6F0] p-3">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#A06C3F]">
                                                        Provider
                                                    </p>
                                                    <p className="mt-0.5 font-semibold text-[#3D2314]">
                                                        {pet.provider.name}
                                                    </p>
                                                    {pet.provider.phone && (
                                                        <p className="mt-0.5 text-xs text-[#724820]">
                                                            {pet.provider.phone}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* ACCEPTED BANNER FOR ADOPTER */}
                                            {status === "accepted" && (
                                                <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-center">
                                                    <PartyPopper className="h-4 w-4 text-emerald-700" />
                                                    <p className="text-sm font-bold text-emerald-800">
                                                        Request Accepted!
                                                    </p>
                                                </div>
                                            )}

                                            {/* DYNAMIC ACTION BUTTON */}
                                            <div className="mt-5">
                                                {renderActionButton(pet)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default UserDashboard;