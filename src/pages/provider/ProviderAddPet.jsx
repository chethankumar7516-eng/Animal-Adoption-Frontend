import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function ProviderAddPet() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        type: "",
        breed: "",
        age: "",
        gender: "",
        description: "",
    });

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Handle Input Change for text inputs/selects
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previousForm) => ({
            ...previousForm,
            [name]: value
        }));

        setError("");
        setMessage("");
    };

    // Handle File Input Change
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
            setError("");
            setMessage("");
        }
    };

    // Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("providerToken");

            if (!token) {
                setError("Authorization token is missing. Please login again.");
                setLoading(false);
                navigate("/login");
                return;
            }

            // Client-side validations
            if (!form.name.trim()) {
                setError("Pet name is required.");
                setLoading(false);
                return;
            }

            if (!form.type) {
                setError("Please select pet type.");
                setLoading(false);
                return;
            }

            if (form.age === "" || Number(form.age) < 0) {
                setError("Please enter a valid age.");
                setLoading(false);
                return;
            }

            if (!form.gender) {
                setError("Please select gender.");
                setLoading(false);
                return;
            }

            if (!form.description.trim()) {
                setError("Description is required.");
                setLoading(false);
                return;
            }

            // Create FormData object to send file & fields
            const formData = new FormData();
            formData.append("name", form.name.trim());
            formData.append("type", form.type);
            formData.append("breed", form.breed.trim());
            formData.append("age", Number(form.age));
            formData.append("gender", form.gender);
            formData.append("description", form.description.trim());

            if (file) {
                formData.append("image", file); // Ensure backend expects 'image' or 'file'
            }

            // API Request using multipart/form-data
            const response = await API.post(
                "/pets/add",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                }
            );
               console.log(response.data)
            if (response.data?.success) {
                setMessage(response.data.message || "Pet added successfully!");
                setForm({
                    name: "",
                    type: "",
                    breed: "",
                    age: "",
                    gender: "",
                    description: "",
                });
                setFile(null);
                setPreviewUrl("");
            } else {
                setError(response.data?.message || "Unable to add pet.");
            }
        } catch (err) {
            console.error("Add pet error:", err.response?.data || err);

            if (err.response?.status === 401) {
                localStorage.removeItem("providerToken");
                setError("Your login session has expired. Redirecting...");
                setTimeout(() => navigate("/login"), 60);
                return;
            }

            if (err.response?.status === 403) {
                setError(err.response?.data?.message || "Only providers can add pets.");
                return;
            }

            if (err.response?.status === 400) {
                setError(err.response?.data?.message || "Please check the pet details.");
                return;
            }

            setError(err.response?.data?.message || "Unable to add pet. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-[#FAF6F0]">
            {/* Header */}
            <header className="w-full border-b border-[#E6DCCF] bg-white">
                <div className="flex w-full items-center justify-between px-6 py-5 lg:px-12 xl:px-16">
                    <div>
                        <h1 className="text-2xl font-black text-[#3D2314]">PetConnect</h1>
                        <p className="mt-1 text-sm text-[#A06C3F]">Provider Portal</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => navigate("/provider/dashboard")}
                        className="rounded-xl border border-[#E6DCCF] bg-white px-5 py-2.5 font-semibold text-[#3D2314] transition hover:bg-[#FAF6F0]"
                    >
                        Dashboard
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <section className="w-full px-6 py-10 lg:px-12 xl:px-16">
                <div className="mb-10">
                    <p className="text-sm font-bold tracking-wider text-[#A06C3F]">
                        PROVIDER PET MANAGEMENT
                    </p>
                    <h2 className="mt-3 text-4xl font-black text-[#3D2314] lg:text-5xl">
                        Add a Pet
                    </h2>
                    <p className="mt-3 max-w-2xl text-base text-[#6E5D4F]">
                        Add a pet with its photo and details so users can discover, connect, and send adoption requests.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="w-full rounded-2xl border border-[#E6DCCF] bg-white p-6 shadow-lg lg:p-10"
                >
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {/* Pet Name */}
                        <div>
                            <label htmlFor="name" className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                Pet Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Luna"
                                required
                                className="w-full rounded-xl border border-[#E6DCCF] px-4 py-3 text-[#3D2314] outline-none transition focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                            />
                        </div>

                        {/* Pet Type */}
                        <div>
                            <label htmlFor="type" className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                Type
                            </label>
                            <select
                                id="type"
                                name="type"
                                value={form.type}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-[#E6DCCF] bg-white px-4 py-3 text-[#3D2314] outline-none transition focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                            >
                                <option value="">Select type</option>
                                <option value="Dog">Dog</option>
                                <option value="Cat">Cat</option>
                                <option value="Bird">Bird</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Breed */}
                        <div>
                            <label htmlFor="breed" className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                Breed
                            </label>
                            <input
                                id="breed"
                                type="text"
                                name="breed"
                                value={form.breed}
                                onChange={handleChange}
                                placeholder="e.g. Labrador"
                                className="w-full rounded-xl border border-[#E6DCCF] px-4 py-3 text-[#3D2314] outline-none transition focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                            />
                        </div>

                        {/* Age */}
                        <div>
                            <label htmlFor="age" className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                Age
                            </label>
                            <input
                                id="age"
                                type="number"
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                                placeholder="Age in years"
                                min="0"
                                required
                                className="w-full rounded-xl border border-[#E6DCCF] px-4 py-3 text-[#3D2314] outline-none transition focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                            />
                        </div>

                        {/* Gender */}
                        <div>
                            <label htmlFor="gender" className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                Gender
                            </label>
                            <select
                                id="gender"
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                required
                                className="w-full rounded-xl border border-[#E6DCCF] bg-white px-4 py-3 text-[#3D2314] outline-none transition focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>

                        {/* Image File Input */}
                        <div>
                            <label htmlFor="image" className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                Pet Image
                            </label>
                            <input
                                id="image"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="w-full rounded-xl border border-[#E6DCCF] px-4 py-2.5 text-sm text-[#3D2314] file:mr-4 file:rounded-lg file:border-0 file:bg-[#8B5A2B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#724820]"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 xl:col-span-3">
                            <label htmlFor="description" className="mb-2 block text-sm font-semibold text-[#3D2314]">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="5"
                                placeholder="Tell users about this pet..."
                                required
                                className="w-full resize-none rounded-xl border border-[#E6DCCF] px-4 py-3 text-[#3D2314] outline-none transition focus:border-[#8B5A2B] focus:ring-2 focus:ring-[#8B5A2B]/20"
                            />
                        </div>

                        {/* Image Preview */}
                        {previewUrl && (
                            <div className="md:col-span-2 xl:col-span-3">
                                <label className="mb-3 block text-sm font-semibold text-[#3D2314]">
                                    Image Preview
                                </label>
                                <div className="overflow-hidden rounded-2xl border border-[#E6DCCF] bg-[#FAF6F0]">
                                    <img
                                        src={previewUrl}
                                        alt={form.name || "Pet preview"}
                                        className="h-80 w-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Messages */}
                    {message && (
                        <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm font-semibold text-green-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Submit Actions */}
                    <div className="mt-10 flex flex-col gap-4 border-t border-[#E6DCCF] pt-6 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={() => navigate("/provider/dashboard")}
                            className="rounded-xl border border-[#E6DCCF] bg-white px-8 py-3.5 font-semibold text-[#3D2314] transition hover:bg-[#FAF6F0]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-xl bg-[#8B5A2B] px-10 py-3.5 font-bold text-white shadow-lg shadow-[#8B5A2B]/20 transition hover:bg-[#724820] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? "Adding Pet..." : "Add Pet"}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default ProviderAddPet;