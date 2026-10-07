import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import { 
    PawPrint, 
    Loader2, 
    AlertCircle, 
    CheckCircle2, 
    XCircle, 
    Hourglass, 
    Filter, 
    ArrowUpDown,
    PartyPopper,
    Cat,
    Dog,
    Bird,
    X
} from "lucide-react";

function UserPets() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Sorting and Filtering states
    const [selectedType, setSelectedType] = useState("All");
    const [sortBy, setSortBy] = useState("default");

    // Pagination
    const [count, setCount] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Image fallback tracking
    const [failedImages, setFailedImages] = useState({});

    // Adoption request messaging
    const [requestLoading, setRequestLoading] = useState(null);
    const [requestMessage, setRequestMessage] = useState("");
    const [requestError, setRequestError] = useState("");

    // Store request statuses mapped by petId for the logged-in user:
    // { [petId]: "pending" | "accepted" | "rejected" }
    const [requestStatuses, setRequestStatuses] = useState({});

    // ======================================================
    // IMAGE FALLBACK HANDLER & ICON RESOLVER
    // ======================================================
    const handleImageError = (petId) => {
        setFailedImages((prev) => ({ ...prev, [petId]: true }));
    };

    const getPetIcon = (type) => {
        switch (type?.toLowerCase()) {
            case "dog":
                return <Dog className="h-16 w-16 text-[#8B5A2B]/40" />;
            case "cat":
                return <Cat className="h-16 w-16 text-[#8B5A2B]/40" />;
            case "bird":
                return <Bird className="h-16 w-16 text-[#8B5A2B]/40" />;
            default:
                return <PawPrint className="h-16 w-16 text-[#8B5A2B]/40" />;
        }
    };

    // ======================================================
    // GET LOGGED-IN USER'S EXISTING ADOPTION REQUESTS
    // ======================================================
    const fetchUserRequests = async () => {
        try {
            // Using API instance matching UserDashboard endpoint
            const response = await API.get("/service/user-requests");

            if (response.data?.success && Array.isArray(response.data?.requests)) {
                const statusMap = {};
                response.data.requests.forEach((req) => {
                    const petId =
                        typeof req.petId === "object"
                            ? req.petId?._id
                            : req.petId;
                    if (petId) {
                        statusMap[petId] = req.status; // 'pending', 'accepted', or 'rejected'
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

            const response = await API.get("/pets", {
                params: { page: count, limit: 6 }
            });

            setPets(response.data?.pets || []);
            setTotalPages(response.data?.totalPages || 1);
        } catch (err) {
            console.error("Get pets error:", err);
            setError(
                err.response?.data?.message || "Unable to load pets."
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // FETCH PETS & REQUESTS + REAL-TIME POLLING
    // ======================================================
    useEffect(() => {
        fetchPets();
        fetchUserRequests();

        const intervalId = setInterval(() => {
            fetchUserRequests();
        }, 10000);

        return () => clearInterval(intervalId);
    }, [count]);

    // ======================================================
    // SEND ADOPTION REQUEST
    // ======================================================
    const sendAdoptionRequest = async (pet) => {
        try {
            setRequestLoading(pet._id);
            setRequestMessage("");
            setRequestError("");

            const providerId = pet.provider?._id || pet.providerId || pet.provider;

            if (!providerId) {
                setRequestError("Provider information is missing for this pet.");
                setRequestLoading(null);
                return;
            }

            const response = await API.post("/service/sendrequest", {
                petId: pet._id,
                providerId: providerId
            });

            if (response.data?.success) {
                setRequestMessage(
                    `${pet.name}: ${
                        response.data.message ||
                        "Adoption request sent successfully."
                    }`
                );

                setRequestStatuses((prev) => ({
                    ...prev,
                    [pet._id]: "pending",
                }));
            } else {
                setRequestError(
                    response.data?.message ||
                        "Unable to send adoption request."
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
                err.response?.data?.message ||
                    "Unable to send adoption request."
            );
        } finally {
            setRequestLoading(null);
        }
    };

    // ======================================================
    // FILTER AND SORT PETS
    // ======================================================
    const processedPets = pets
        .filter((pet) => {
            if (selectedType === "All") return true;
            return pet.type?.toLowerCase() === selectedType.toLowerCase();
        })
        .sort((a, b) => {
            if (sortBy === "name-asc") return a.name.localeCompare(b.name);
            if (sortBy === "name-desc") return b.name.localeCompare(a.name);
            if (sortBy === "age-asc") return Number(a.age) - Number(b.age);
            if (sortBy === "age-desc") return Number(b.age) - Number(a.age);
            if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            return 0;
        });

    // ======================================================
    // CLEAR MESSAGES
    // ======================================================
    const clearMessage = () => {
        setRequestMessage("");
        setRequestError("");
    };

    // ======================================================
    // PAGINATION HANDLERS
    // ======================================================
    const handleIncrement = () => {
        setCount((prev) => Math.min(prev + 1, totalPages));
    };

    const handleDecrement = () => {
        setCount((prev) => Math.max(prev - 1, 1));
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
        <main className="min-h-screen bg-[#FAF6F0] text-[#3D2314]">

            {/* HEADER */}
            <header className="border-b border-[#E6DCCF] bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8B5A2B] text-white shadow-md">
                            <PawPrint className="h-6 w-6 stroke-[2.5]" />
                        </div>
                        <div>
                            <h1 className="font-black text-[#3D2314] text-lg leading-tight">
                                PetConnect
                            </h1>
                            <p className="text-xs font-semibold text-[#A06C3F]">
                                User Portal
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/user/dashboard"
                        className="rounded-xl border border-[#E6DCCF] bg-[#FAF6F0] px-4 py-2 text-sm font-bold text-[#724820] transition hover:bg-[#E6DCCF]/50"
                    >
                        Dashboard
                    </Link>
                </div>
            </header>

            {/* CONTENT */}
            <section className="mx-auto max-w-7xl px-6 py-12">

                {/* TITLE & CONTROLS */}
                <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p className="font-bold tracking-wide uppercase text-xs text-[#A06C3F]">
                            FIND YOUR PET
                        </p>
                        <h2 className="mt-1 text-4xl font-black text-[#3D2314]">
                            Available Pets
                        </h2>
                        <p className="mt-2 text-sm font-semibold text-[#724820]">
                            Browse pets added by our registered providers.
                        </p>
                    </div>

                    {/* FILTER & SORT BAR */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* FILTER BY TYPE */}
                        <div className="flex items-center gap-2 rounded-2xl border border-[#E6DCCF] bg-white px-3 py-2 shadow-sm">
                            <Filter className="h-4 w-4 text-[#8B5A2B]" />
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="bg-transparent font-bold text-sm text-[#3D2314] focus:outline-none cursor-pointer"
                            >
                                <option value="All">All Types</option>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Bird">Bird</option>
                            </select>
                        </div>

                        {/* SORT BY */}
                        <div className="flex items-center gap-2 rounded-2xl border border-[#E6DCCF] bg-white px-3 py-2 shadow-sm">
                            <ArrowUpDown className="h-4 w-4 text-[#8B5A2B]" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent font-bold text-sm text-[#3D2314] focus:outline-none cursor-pointer"
                            >
                                <option value="default">Sort By: Default</option>
                                <option value="name-asc">Name (A - Z)</option>
                                <option value="name-desc">Name (Z - A)</option>
                                <option value="age-asc">Age (Youngest First)</option>
                                <option value="age-desc">Age (Oldest First)</option>
                                <option value="newest">Newest First</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* SUCCESS MESSAGE BANNER */}
                {requestMessage && (
                    <div className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-4 text-emerald-800 shadow-sm">
                        <div className="flex items-center gap-2 font-medium">
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                            <p>{requestMessage}</p>
                        </div>
                        <button
                            type="button"
                            onClick={clearMessage}
                            className="font-bold text-emerald-700 hover:text-emerald-900"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* ERROR BANNER */}
                {requestError && (
                    <div className="mb-6 flex items-center justify-between rounded-2xl border border-rose-300 bg-rose-50 px-5 py-4 text-rose-800 shadow-sm">
                        <div className="flex items-center gap-2 font-medium text-sm">
                            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                            <p>{requestError}</p>
                        </div>
                        <button
                            type="button"
                            onClick={clearMessage}
                            className="font-bold text-rose-700 hover:text-rose-900"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                )}

                {/* LOADING STATE */}
                {loading && (
                    <div className="rounded-3xl border border-[#E6DCCF] bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B5A2B]/10 text-[#8B5A2B]">
                            <PawPrint className="h-9 w-9 animate-bounce" />
                        </div>
                        <p className="mt-4 font-bold text-[#724820]">
                            Loading pets...
                        </p>
                    </div>
                )}

                {/* ERROR STATE */}
                {!loading && error && (
                    <div className="rounded-3xl border border-rose-300 bg-rose-50 p-6">
                        <div className="flex items-center gap-2 font-semibold text-rose-800">
                            <AlertCircle className="h-5 w-5 text-rose-600" />
                            <p>{error}</p>
                        </div>
                        <button
                            type="button"
                            onClick={fetchPets}
                            className="mt-4 rounded-xl bg-[#8B5A2B] px-5 py-2.5 font-bold text-white shadow-sm transition hover:bg-[#724820]"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* EMPTY STATE */}
                {!loading && !error && processedPets.length === 0 && (
                    <div className="rounded-3xl border border-[#E6DCCF] bg-white p-12 text-center shadow-sm">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B5A2B]/10 text-[#8B5A2B]">
                            <PawPrint className="h-10 w-10 stroke-[2]" />
                        </div>
                        <h3 className="mt-4 text-2xl font-black text-[#3D2314]">
                            No pets available
                        </h3>
                        <p className="mt-1 font-semibold text-[#A06C3F]">
                            No pets match your current filter criteria.
                        </p>
                    </div>
                )}

                {/* PET CARDS GRID */}
                {!loading && !error && processedPets.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {processedPets.map((pet) => {
                                const petImg = pet.image || pet.pet_img;
                                const hasImageFailed = failedImages[pet._id];
                                const showImage = petImg && !hasImageFailed;
                                const status = requestStatuses[pet._id];
                                const isAdopted = pet.status === "Adopted" || status === "accepted";

                                return (
                                    <div
                                        key={pet._id}
                                        className="overflow-hidden rounded-2xl border border-[#E6DCCF] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md flex flex-col justify-between"
                                    >
                                        <div>
                                            {/* IMAGE */}
                                            <div className="flex h-52 items-center justify-center overflow-hidden bg-[#FAF6F0]">
                                                {showImage ? (
                                                    <img
                                                        src={
                                                            petImg.startsWith("http://") || petImg.startsWith("https://")
                                                                ? petImg
                                                                : `https://res.cloudinary.com/vfhlzi8w/image/upload/${petImg}`
                                                        }
                                                        alt={pet.name || "Pet"}
                                                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                                                        onError={() => handleImageError(pet._id)}
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center">
                                                        {getPetIcon(pet.type)}
                                                    </div>
                                                )}
                                            </div>

                                            {/* DETAILS */}
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
                                                            <strong className="text-[#3D2314]">Breed:</strong>{" "}
                                                            {pet.breed}
                                                        </p>
                                                    )}
                                                    <p>
                                                        <strong className="text-[#3D2314]">Age:</strong>{" "}
                                                        {pet.age} years
                                                    </p>
                                                    <p>
                                                        <strong className="text-[#3D2314]">Gender:</strong>{" "}
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
                                                            {typeof pet.provider === "object"
                                                                ? pet.provider.name
                                                                : pet.provider}
                                                        </p>
                                                        {typeof pet.provider === "object" && pet.provider.phone && (
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
                                            </div>
                                        </div>

                                        {/* ACTION BUTTONS */}
                                        <div className="p-6 pt-0 space-y-3">
                                            {renderActionButton(pet)}

                                            <Link
                                                to={`/user/messages?petId=${pet._id}`}
                                                className="block w-full rounded-xl border border-[#8B5A2B] bg-white px-4 py-2.5 text-center text-sm font-bold text-[#8B5A2B] transition hover:bg-[#FAF6F0]"
                                            >
                                                Contact Provider
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* PAGINATION */}
                        {totalPages > 1 && (
                            <div className="mt-12 flex items-center justify-center gap-4">
                                <button
                                    type="button"
                                    onClick={handleDecrement}
                                    disabled={count === 1}
                                    className="rounded-xl bg-[#8B5A2B] px-5 py-2 text-lg font-bold text-white shadow-sm transition hover:bg-[#724820] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    −
                                </button>

                                <div className="rounded-xl border border-[#E6DCCF] bg-white px-5 py-2 font-bold text-[#3D2314] shadow-sm">
                                    Page {count} of {totalPages}
                                </div>

                                <button
                                    type="button"
                                    onClick={handleIncrement}
                                    disabled={count === totalPages}
                                    className="rounded-xl bg-[#8B5A2B] px-5 py-2 text-lg font-bold text-white shadow-sm transition hover:bg-[#724820] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    +
                                </button>
                            </div>
                        )}
                    </>
                )}
            </section>
        </main>
    );
}

export default UserPets;