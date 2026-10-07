import { useEffect, useState, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../../services/api";
import { 
    PawPrint, 
    ArrowLeft, 
    Send, 
    Loader2, 
    AlertCircle, 
    CheckCircle2, 
    MessageSquare, 
    User, 
    Dog 
} from "lucide-react";

function UserMessages() {
    const [searchParams] = useSearchParams();
    const petId = searchParams.get("petId");

    const [pet, setPet] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const messagesEndRef = useRef(null);
    const userToken = localStorage.getItem("userToken");

    // Auto-scroll chat to the bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // ==========================
    // LOAD PET
    // ==========================
    const loadPet = async () => {
        try {
            if (!petId) {
                setError("No pet selected. Please select a pet first.");
                setLoading(false);
                return;
            }

            const response = await API.get(`/pets/${petId}`);

            if (response.data?.success) {
                setPet(response.data.pet);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load pet details."
            );
        }
    };

    // ==========================
    // LOAD MESSAGES
    // ==========================
    const loadMessages = async () => {
        try {
            const response = await API.get("/messages/user", {
                userRole: "user",
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            if (response.data?.success) {
                let allMessages = response.data.messages || [];

                if (petId) {
                    allMessages = allMessages.filter(
                        (item) =>
                            item.pet?._id === petId ||
                            item.pet === petId
                    );
                }

                setMessages(allMessages);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load messages."
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================
    // INITIAL LOAD & AUTO REFRESH
    // ==========================
    useEffect(() => {
        loadPet();
        loadMessages();
    }, [petId]);

    useEffect(() => {
        const interval = setInterval(() => {
            loadMessages();
        }, 3000);

        return () => clearInterval(interval);
    }, [petId]);

    // ==========================
    // SEND MESSAGE
    // ==========================
    const sendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        if (!pet) {
            setError("Pet information is missing.");
            return;
        }

        if (!pet.provider) {
            setError("This pet does not have an assigned provider.");
            return;
        }

        setSending(true);
        setError("");
        setSuccess("");

        try {
            const providerId =
                typeof pet.provider === "object"
                    ? pet.provider._id
                    : pet.provider;

            const response = await API.post(
                "/messages/send",
                {
                    receiver: providerId,
                    receiverModel: "Provider",
                    pet: petId,
                    message: message.trim()
                },
                {
                    userRole: "user",
                    headers: {
                        Authorization: `Bearer ${userToken}`
                    }
                }
            );

            if (response.data?.success) {
                setMessage("");
                setSuccess("Message sent.");

                await loadMessages();

                setTimeout(() => {
                    setSuccess("");
                }, 2000);
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Message could not be sent."
            );
        } finally {
            setSending(false);
        }
    };

    // Get Provider Name dynamically
    const providerName =
        typeof pet?.provider === "object"
            ? pet.provider.name || pet.provider.fullName || pet.provider.username || "Pet Provider"
            : "Pet Provider";

    return (
        <main className="min-h-screen bg-[#FAF6F0] text-[#3D2314]">

            {/* HEADER */}
            <header className="sticky top-0 z-10 border-b border-[#E6DCCF] bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

                    <Link to="/user/dashboard" className="flex items-center gap-3 group">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8B5A2B] text-white shadow-md transition group-hover:bg-[#724820]">
                            <PawPrint className="h-6 w-6 stroke-[2.5]" />
                        </div>

                        <div>
                            <h1 className="text-xl font-black tracking-tight text-[#3D2314]">
                                PetConnect
                            </h1>
                            <p className="text-xs font-bold text-[#A06C3F]">
                                Direct Messaging
                            </p>
                        </div>
                    </Link>

                    <Link
                        to="/user/dashboard"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#8B5A2B] transition hover:text-[#724820]"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Dashboard
                    </Link>

                </div>
            </header>

            {/* CONTENT */}
            <section className="mx-auto max-w-4xl px-6 py-10">

                <div className="mb-6">
                    <p className="text-xs font-black uppercase tracking-widest text-[#A06C3F]">
                        Messages
                    </p>
                    <h2 className="mt-1 text-3xl font-black tracking-tight text-[#3D2314]">
                        Provider Conversation
                    </h2>
                    <p className="mt-1 text-sm font-medium text-[#724820]/80">
                        Inquire directly with the shelter or provider about your potential pet.
                    </p>
                </div>

                {/* ALERT MESSAGES */}
                {error && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3.5 text-sm font-medium text-rose-800">
                        <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
                        <p>{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-300 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                        <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                        <p>{success}</p>
                    </div>
                )}

                {/* PET CONTEXT CARD */}
                {pet && (
                    <div className="mb-6 flex items-center gap-4 rounded-3xl border border-[#E6DCCF] bg-white p-4 shadow-sm">
                        {pet.image ? (
                            <img
                                src={
                                    pet.image.startsWith("http")
                                        ? pet.image
                                        : `https://res.cloudinary.com/vfhlzi8w/image/upload/${pet.image}`
                                }
                                alt={pet.name}
                                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-[#8B5A2B]/10"
                            />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FAF6F0] text-[#8B5A2B]">
                                <Dog className="h-8 w-8 stroke-[1.75]" />
                            </div>
                        )}

                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[#A06C3F]">Inquiring About</span>
                            <h3 className="text-lg font-black text-[#3D2314]">
                                {pet.name}
                            </h3>
                            <p className="text-xs font-semibold text-[#724820]/70">
                                {pet.type} {pet.breed ? `• ${pet.breed}` : ""}
                            </p>
                        </div>
                    </div>
                )}

                {/* MAIN CHAT WRAPPER */}
                <div className="overflow-hidden rounded-3xl border border-[#E6DCCF] bg-white shadow-sm">

                    {/* PROVIDER HEADER BAR */}
                    <div className="flex items-center gap-3.5 border-b border-[#E6DCCF] bg-white px-6 py-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#8B5A2B]/10 text-[#8B5A2B]">
                            <User className="h-5 w-5 stroke-[2.25]" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-[#3D2314]">
                                {providerName}
                            </h3>
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Active Conversation
                            </span>
                        </div>
                    </div>

                    {/* MESSAGES THREAD */}
                    <div className="h-[420px] space-y-4 overflow-y-auto bg-[#FAF6F0]/50 p-6">
                        {loading ? (
                            <div className="flex h-full items-center justify-center gap-2 text-sm font-bold text-[#A06C3F]">
                                <Loader2 className="h-5 w-5 animate-spin text-[#8B5A2B]" />
                                Loading chat history...
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex h-full items-center justify-center text-center">
                                <div>
                                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E6DCCF]/50 text-[#8B5A2B]">
                                        <MessageSquare className="h-7 w-7 stroke-[1.5]" />
                                    </div>
                                    <h3 className="text-base font-bold text-[#3D2314]">
                                        No messages yet
                                    </h3>
                                    <p className="mt-1 text-xs font-semibold text-[#A06C3F]">
                                        Send a message below to start chatting with {providerName}.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            messages.map((item) => {
                                const isMine = item.senderModel === "User";

                                return (
                                    <div
                                        key={item._id}
                                        className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-md space-y-1 rounded-2xl px-4 py-3 text-sm shadow-sm ${
                                                isMine
                                                    ? "rounded-br-xs bg-[#8B5A2B] text-white"
                                                    : "rounded-bl-xs border border-[#E6DCCF] bg-white text-[#3D2314]"
                                            }`}
                                        >
                                            <p className="leading-relaxed font-medium">{item.message}</p>

                                            <div
                                                className={`flex items-center justify-end gap-1.5 text-[10px] font-semibold ${
                                                    isMine ? "text-white/70" : "text-[#A06C3F]"
                                                }`}
                                            >
                                                <span>
                                                    {new Date(item.createdAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                                {isMine && <span>• Sent</span>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* INPUT BAR */}
                    <form
                        onSubmit={sendMessage}
                        className="flex gap-3 border-t border-[#E6DCCF] bg-white p-4"
                    >
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your message here..."
                            disabled={sending || !pet}
                            className="flex-1 rounded-xl border border-[#E6DCCF] bg-[#FAF6F0] px-4 py-3 text-sm font-medium text-[#3D2314] placeholder-[#A06C3F]/60 outline-none transition focus:border-[#8B5A2B] focus:bg-white focus:ring-4 focus:ring-[#8B5A2B]/10 disabled:bg-stone-100 disabled:cursor-not-allowed"
                        />

                        <button
                            type="submit"
                            disabled={sending || !message.trim() || !pet}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#8B5A2B] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#724820] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {sending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <span>Send</span>
                                    <Send className="h-4 w-4 stroke-[2.5]" />
                                </>
                            )}
                        </button>
                    </form>

                </div>

            </section>

        </main>
    );
}

export default UserMessages;