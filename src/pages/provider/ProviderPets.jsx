import React, { useState, useEffect } from 'react';
import {
  FaPaw,
  FaDog,
  FaCat,
  FaEdit,
  FaTrash,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaArrowLeft,
  FaMars,
  FaVenus,
  FaExclamationTriangle
} from "react-icons/fa";
import { Link } from 'react-router-dom';
import API from "../../services/api";

const ProviderPets = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const serverUrl = "http://localhost:5000";

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Edit Modal & Form States
  const [editingPet, setEditingPet] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Dog',
    breed: '',
    age: '',
    gender: 'Male',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete Modal State
  const [deletingPet, setDeletingPet] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  // Image URL Helper
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      return "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop";
    }
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    const cleanPath = imagePath
      .replace(/\\/g, "/")
      .replace(/^\//, "")
      .replace(/^uploads\//, "");

    return `${serverUrl}/uploads/${cleanPath}`;
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    setError("");

    const providerId = localStorage.getItem("providerId");
    if (!providerId) {
      setError("Provider ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await API.get(`/providers/getpetbyprovider/${providerId}`);
      const petsData = res.data?.pets || res.data?.data || res.data || [];
      setPets(Array.isArray(petsData) ? petsData : []);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError(err.response?.data?.message || "Unable to load pets.");
    } finally {
      setLoading(false);
    }
  };

  // Pagination Calculations
  const totalPages = Math.ceil(pets.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPetsList = pets.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setEditingPet(item);
    setFormData({
      name: item.name || '',
      type: item.type || item.category || 'Dog',
      breed: item.breed || '',
      age: item.age || '',
      gender: item.gender || 'Male',
      description: item.description || ''
    });
    setSelectedFile(null);
    setEditError("");
  };

  const handleCloseEditModal = () => {
    setEditingPet(null);
    setSelectedFile(null);
    setEditError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update Pet Request
  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setEditError("");

    const petId = editingPet._id || editingPet.id;
    const token = localStorage.getItem("providerToken");

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("type", formData.type);
      payload.append("breed", formData.breed);
      payload.append("age", formData.age);
      payload.append("gender", formData.gender);
      payload.append("description", formData.description);

      if (selectedFile) {
        payload.append("image", selectedFile);
      } else {
        const existingImage = editingPet.pic || editingPet.image || editingPet.pet_img || editingPet.img || "";
        payload.append("image", existingImage);
      }

      await API.put(`/pets/update/${petId}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data"
        }
      });

      handleCloseEditModal();
      fetchPets();
    } catch (err) {
      console.error("Error updating pet:", err);
      setEditError(err.response?.data?.message || "Failed to update pet details.");
    } finally {
      setUpdating(false);
    }
  };

  // Delete Handler
  const handleOpenDelete = (pet) => {
    setDeletingPet(pet);
    setDeleteError("");
  };

  const handleCloseDeleteModal = () => {
    setDeletingPet(null);
    setDeleteError("");
  };

  const handleDeletePet = async () => {
    if (!deletingPet) return;

    setDeleting(true);
    setDeleteError("");

    const petId = deletingPet._id || deletingPet.id;
    const token = localStorage.getItem("providerToken");

    try {
      await API.delete(`/pets/delete/${petId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setPets((prevPets) => {
        const updatedList = prevPets.filter((item) => (item._id || item.id) !== petId);
        const newTotalPages = Math.ceil(updatedList.length / itemsPerPage);
        if (currentPage > newTotalPages && newTotalPages > 0) {
          setCurrentPage(newTotalPages);
        }
        return updatedList;
      });

      handleCloseDeleteModal();
    } catch (err) {
      console.error("Error deleting pet:", err);
      setDeleteError(err.response?.data?.message || "Failed to delete pet.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between">

      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2.5 rounded-xl text-white shadow-md">
              <FaPaw className="text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                My Listed Pets
              </h1>
              <p className="text-slate-500 text-xs font-medium">
                Manage and update your active adoption listings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/provider/dashboard"
              className="flex items-center gap-2 border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg text-xs font-semibold transition"
            >
              <FaArrowLeft />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/provider/pets/add"
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm transition active:scale-95"
            >
              <FaPlus />
              <span>Add New Pet</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl w-full mx-auto p-6 md:p-8 flex-1">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FaDog className="text-amber-500 text-lg" />
            <h2 className="text-lg font-bold text-slate-800">
              Active Listings ({pets.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
            <div className="w-9 h-9 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Loading pet listings...</p>
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center max-w-md mx-auto my-8">
            <p className="font-semibold text-red-600 text-sm">{error}</p>
            <button
              type="button"
              onClick={fetchPets}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        ) : pets && pets.length > 0 ? (
          <>
            {/* Grid of Pet Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {currentPetsList.map((pet, index) => {
                const petId = pet._id || pet.id;
                const rawPic = pet.pic || pet.image || pet.pet_img || pet.img;
                const imageUrl = getImageUrl(rawPic);

                return (
                  <div
                    key={petId || index}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    {/* Card Image Container */}
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img
                        src={`https://res.cloudinary.com/vfhlzi8w/image/upload/${pet.image}`}
                        alt={pet.name || "Pet"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop";
                        }}
                      />
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                        {pet.type?.toLowerCase() === 'cat' ? <FaCat className="text-amber-500" /> : <FaDog className="text-amber-500" />}
                        {pet.type || 'Pet'}
                      </span>

                      {/* Action Buttons Overlay */}
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(pet)}
                          className="bg-white/90 hover:bg-white text-slate-700 hover:text-amber-600 p-2 rounded-full shadow-md transition"
                          title="Edit Pet"
                        >
                          <FaEdit className="text-xs" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(pet)}
                          className="bg-white/90 hover:bg-white text-slate-700 hover:text-red-600 p-2 rounded-full shadow-md transition"
                          title="Delete Pet"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>

                    {/* Card Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-bold text-slate-900 text-lg truncate">
                            {pet.name || "Unnamed"}
                          </h3>
                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            {pet.gender?.toLowerCase() === 'female' ? (
                              <FaVenus className="text-pink-500" />
                            ) : (
                              <FaMars className="text-blue-500" />
                            )}
                            {pet.gender || 'N/A'}
                          </span>
                        </div>

                        <p className="text-xs text-[#8B5A2B] font-medium mb-2">
                          {pet.breed || "Mixed Breed"} • {pet.age} {Number(pet.age) === 1 ? 'yr' : 'yrs'} old
                        </p>

                        <p className="text-xs text-slate-600 line-clamp-2">
                          {pet.description || "No description provided for this pet."}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => handleOpenEditModal(pet)}
                          className="w-full text-center py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition"
                        >
                          Edit Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 mt-8 pt-4">
                <p className="text-xs text-slate-500">
                  Showing <span className="font-semibold text-slate-700">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-semibold text-slate-700">{Math.min(indexOfLastItem, pets.length)}</span> of{' '}
                  <span className="font-semibold text-slate-700">{pets.length}</span> pets
                </p>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition"
                  >
                    <FaChevronLeft className="text-xs" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${currentPage === page
                          ? 'bg-amber-500 text-white'
                          : 'text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-40 transition"
                  >
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="bg-amber-50 p-4 rounded-full text-amber-500 mb-3">
              <FaDog className="text-4xl" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Pets Listed Yet</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-sm">
              You haven't added any pets for adoption. Click the button below to publish your first listing.
            </p>
            <Link
              to="/provider/pets/add"
              className="mt-4 flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2 text-xs font-bold text-white hover:bg-amber-600 transition shadow-sm"
            >
              <FaPlus className="text-xs" />
              <span>Add First Pet</span>
            </Link>
          </div>
        )}
      </main>

      {/* Edit Pet Modal */}
      {editingPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 border border-slate-100 relative max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit Pet Details</h3>
              <button onClick={handleCloseEditModal} className="text-slate-400 hover:text-slate-600 p-1">
                <FaTimes />
              </button>
            </div>

            {editError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pet Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Bird">Bird</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Breed</label>
                  <input
                    type="text"
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full text-sm px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Replace Image (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
              </div>

              <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseEditModal}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
                >
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingPet && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-slate-100 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-3">
              <FaExclamationTriangle className="text-lg" />
            </div>

            <h3 className="text-base font-bold text-slate-900">Remove Pet Listing?</h3>
            <p className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete <span className="font-semibold text-slate-800">{deletingPet.name}</span>? This action cannot be undone.
            </p>

            {deleteError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600 font-semibold">
                {deleteError}
              </div>
            )}

            <div className="flex justify-center gap-2 mt-5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseDeleteModal}
                className="flex-1 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePet}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} Pet Adoption Portal. All rights reserved.
        </div>
      </footer>

    </div>
  );
};

export default ProviderPets;