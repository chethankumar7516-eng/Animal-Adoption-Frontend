import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";

function ProviderMessages() {
    const [messages, setMessages] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const messagesEndRef = useRef(null);

    const providerToken = localStorage.getItem("providerToken");

    // ======================================================
    // GET PROVIDER MESSAGES
    // ======================================================

    const loadMessages = useCallback(
        async (isInitial = false) => {
            try {
                if (isInitial) {
                    setLoading(true);
                }

                const response = await API.get("/messages/provider", {
                    userRole: "provider",
                    headers: {
                        Authorization: `Bearer ${providerToken}`,
                    },
                });

                if (response.data?.success) {
                    setMessages(response.data.messages || []);
                }
            } catch (err) {
                console.error("Load messages error:", err);

                setError(
                    err.response?.data?.message ||
                        "Unable to load messages."
                );
            } finally {
                if (isInitial) {
                    setLoading(false);
                }
            }
        },
        [providerToken]
    );

    // ======================================================
    // LOAD MESSAGES + AUTO REFRESH
    // ======================================================

    useEffect(() => {
        loadMessages(true);

        const interval = setInterval(() => {
            loadMessages(false);
        }, 3000);

        return () => clearInterval(interval);
    }, [loadMessages]);

    // ======================================================
    // GET OTHER USER ID
    // ======================================================

    const getOtherUserId = (item) => {
        if (item.senderModel === "User") {
            return String(item.sender?._id || item.sender || "");
        }
        if (item.receiverModel === "User") {
            return String(item.receiver?._id || item.receiver || "");
        }
        return "";
    };

    // ======================================================
    // GET USER DETAILS & PET NAME
    // ======================================================

    const getUserName = (item) => {
        if (item.senderModel === "User" && item.sender) return item.sender.name || "User";
        if (item.receiverModel === "User" && item.receiver) return item.receiver.name || "User";
        return "User";
    };

    const getUserEmail = (item) => {
        if (item.senderModel === "User" && item.sender) return item.sender.email || "";
        if (item.receiverModel === "User" && item.receiver) return item.receiver.email || "";
        return "";
    };

    const getUserPhone = (item) => {
        if (item.senderModel === "User" && item.sender) return item.sender.phone || "";
        if (item.receiverModel === "User" && item.receiver) return item.receiver.phone || "";
        return "";
    };

    const getPetName = (item) => {
        if (item.pet && typeof item.pet === "object") {
            return item.pet.name || "";
        }
        return "";
    };

    // ======================================================
    // GROUP MESSAGES BY USER
    // ======================================================

    const conversations = useMemo(() => {
        const users = {};

        messages.forEach((item) => {
            const userId = getOtherUserId(item);
            if (!userId) return;

            if (!users[userId]) {
                users[userId] = {
                    id: userId,
                    name: getUserName(item),
                    email: getUserEmail(item),
                    phone: getUserPhone(item),
                    petName: getPetName(item),
                    messages: [],
                };
            }

            users[userId].messages.push(item);

            // Update details if available
            if (item.senderModel === "User") {
                if (item.sender?.name) users[userId].name = item.sender.name;
                if (item.sender?.email) users[userId].email = item.sender.email;
                if (item.sender?.phone) users[userId].phone = item.sender.phone;
            }

            if (item.receiverModel === "User") {
                if (item.receiver?.name) users[userId].name = item.receiver.name;
                if (item.receiver?.email) users[userId].email = item.receiver.email;
                if (item.receiver?.phone) users[userId].phone = item.receiver.phone;
            }

            // Capture pet name from populated pet object
            const currentPetName = getPetName(item);
            if (currentPetName) {
                users[userId].petName = currentPetName;
            }
        });

        return Object.values(users);
    }, [messages]);

    // SELECT FIRST CONVERSATION
    useEffect(() => {
        if (!selectedUserId && conversations.length > 0) {
            setSelectedUserId(conversations[0].id);
        }
    }, [conversations, selectedUserId]);

    const currentConversation = useMemo(() => {
        return conversations.find((conv) => conv.id === String(selectedUserId));
    }, [conversations, selectedUserId]);

    const currentMessages = useMemo(() => {
        if (!selectedUserId) return [];
        return messages.filter((item) => getOtherUserId(item) === String(selectedUserId));
    }, [messages, selectedUserId]);

    // Extract associated Pet ID reliably
    const currentPetId = useMemo(() => {
        if (currentMessages.length === 0) return null;
        for (let i = currentMessages.length - 1; i >= 0; i--) {
            const petObj = currentMessages[i].pet;
            if (petObj) {
                return typeof petObj === "object" ? petObj._id || petObj.id : petObj;
            }
        }
        return null;
    }, [currentMessages]);

    // AUTO SCROLL
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [currentMessages]);

    // ======================================================
    // SEND PROVIDER REPLY
    // ======================================================

    const sendMessage = async (e) => {
        e.preventDefault();

        const trimmedMsg = message.trim();
        if (!trimmedMsg) return;

        if (!selectedUserId) {
            setError("Please select a user conversation.");
            return;
        }

        setSending(true);
        setError("");
        setSuccess("");

        try {
            const payload = {
                receiver: selectedUserId,
                receiverModel: "User",
                message: trimmedMsg,
            };

            // Include pet ID if available in conversation context
            if (currentPetId) {
                payload.pet = currentPetId;
            }

            const response = await API.post("/messages/send", payload, {
                userRole: "provider",
                headers: {
                    Authorization: `Bearer ${providerToken}`,
                },
            });

            if (response.data?.success) {
                setMessage("");
                setSuccess("Reply sent successfully.");
                await loadMessages(false);

                setTimeout(() => {
                    setSuccess("");
                }, 2000);
            }
        } catch (err) {
            console.error("Send message error:", err);
            setError(
                err.response?.data?.message || "Message could not be sent."
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <main className="min-h-screen w-full bg-[#FAF6F0]">
            <header className="w-full border-b border-[#E6DCCF] bg-white">
                <div className="flex w-full items-center justify-between px-6 py-5 lg:px-12 xl:px-16">
                    <Link to="/provider/dashboard" className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#8B5A2B] text-white">
                            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.5 1c-.83 0-1.5.67-1.5 1.5S7.67 14 8.5 14s1.5-.67 1.5-1.5S9.33 11 8.5 11zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-[#3D2314]">PetConnect</h1>
                            <p className="text-xs text-[#A06C3F]">Provider Portal</p>
                        </div>
                    </Link>
                    <Link
                        to="/provider/dashboard"
                        className="flex items-center gap-2 rounded-xl border border-[#E6DCCF] bg-white px-5 py-2.5 font-bold text-[#8B5A2B] transition hover:bg-[#FAF6F0]"
                    >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Dashboard
                    </Link>
                </div>
            </header>

            <section className="w-full px-6 py-10 lg:px-12 xl:px-16">
                <div className="mb-8">
                    <p className="text-sm font-bold tracking-wider text-[#A06C3F]">PROVIDER MESSAGES</p>
                    <h2 className="mt-3 text-4xl font-black text-[#3D2314] lg:text-5xl">User Conversations</h2>
                    <p className="mt-3 text-base text-[#6E5D4F]">Reply to users interested in your pets.</p>
                </div>

                {error && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-semibold text-red-600">
                        <svg className="h-5 w-5 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 font-semibold text-emerald-700">
                        <svg className="h-5 w-5 shrink-0 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{success}</span>
                    </div>
                )}

                <div className="grid min-h-[650px] gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
                    {/* LEFT - CONVERSATIONS */}
                    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#E6DCCF] bg-white shadow-sm">
                        <div className="border-b border-[#E6DCCF] p-5">
                            <h3 className="text-lg font-bold text-[#3D2314]">Conversations</h3>
                            <p className="mt-1 text-xs text-[#6E5D4F]">
                                {conversations.length} user{conversations.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        <div className="max-h-[570px] flex-1 overflow-y-auto p-3">
                            {loading ? (
                                <p className="p-4 text-sm text-[#6E5D4F]">Loading conversations...</p>
                            ) : conversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-sm font-semibold text-[#3D2314]">No conversations yet</p>
                                    <p className="mt-2 text-xs leading-5 text-[#6E5D4F]">User messages will appear here.</p>
                                </div>
                            ) : (
                                conversations.map((conv) => {
                                    const lastMsg = conv.messages[conv.messages.length - 1];
                                    const isSelected = selectedUserId === conv.id;

                                    return (
                                        <button
                                            key={conv.id}
                                            type="button"
                                            onClick={() => setSelectedUserId(conv.id)}
                                            className={`mb-2 w-full rounded-xl p-4 text-left transition ${
                                                isSelected
                                                    ? "bg-[#FAF6F0] ring-2 ring-[#8B5A2B]"
                                                    : "hover:bg-[#FAF6F0]"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FAF6F0] text-[#8B5A2B]">
                                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-bold text-[#3D2314]">
                                                        {conv.name}
                                                        {conv.petName && (
                                                            <span className="ml-1 text-xs font-normal text-[#8B5A2B]">
                                                                (Pet: {conv.petName})
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="mt-1 truncate text-xs text-[#6E5D4F]">{lastMsg?.message}</p>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* RIGHT - CHAT AREA */}
                    <div className="flex min-h-[650px] flex-col overflow-hidden rounded-2xl border border-[#E6DCCF] bg-white shadow-sm">
                        <div className="flex items-center gap-4 border-b border-[#E6DCCF] bg-white p-5">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF6F0] text-[#8B5A2B]">
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div className="min-w-0">
                                <h3 className="truncate font-bold text-[#3D2314]">
                                    {selectedUserId ? currentConversation?.name || "User" : "No user selected"}
                                    {selectedUserId && currentConversation?.petName && (
                                        <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-[#FAF6F0] px-2 py-0.5 text-xs font-semibold text-[#8B5A2B] border border-[#E6DCCF]">
                                            <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-3.5 1c-.83 0-1.5.67-1.5 1.5S7.67 14 8.5 14s1.5-.67 1.5-1.5S9.33 11 8.5 11zm7 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/>
                                            </svg>
                                            Re: {currentConversation.petName}
                                        </span>
                                    )}
                                </h3>
                                {selectedUserId && currentConversation?.email && (
                                    <p className="text-xs text-[#6E5D4F]">{currentConversation.email}</p>
                                )}
                                <p className="text-sm text-emerald-600">
                                    {selectedUserId ? "Conversation Active" : "Select a conversation"}
                                </p>
                            </div>
                        </div>

                        {/* MESSAGES LIST */}
                        <div className="flex-1 overflow-y-auto bg-[#FAF6F0] p-6">
                            {!selectedUserId ? (
                                <div className="flex h-full min-h-[400px] items-center justify-center text-center">
                                    <div>
                                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E6DCCF]/40 text-[#8B5A2B]">
                                            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                        </div>
                                        <h3 className="mt-4 text-lg font-bold text-[#3D2314]">Select a conversation</h3>
                                        <p className="mt-2 text-sm text-[#6E5D4F]">Choose a user from the left side to start messaging.</p>
                                    </div>
                                </div>
                            ) : currentMessages.length === 0 ? (
                                <div className="flex h-full min-h-[400px] items-center justify-center text-[#6E5D4F]">
                                    No messages in this chat.
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {currentMessages.map((item) => {
                                        const isMine = item.senderModel === "Provider";
                                        const senderName = isMine ? "You" : item.sender?.name || "User";

                                        return (
                                            <div
                                                key={item._id}
                                                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                                                        isMine
                                                            ? "rounded-br-sm bg-[#8B5A2B] text-white"
                                                            : "rounded-bl-sm border border-[#E6DCCF] bg-white text-[#3D2314] shadow-sm"
                                                    }`}
                                                >
                                                    <p className={`mb-1 text-xs font-bold ${isMine ? "text-[#FAF6F0]" : "text-[#8B5A2B]"}`}>
                                                        {senderName}
                                                    </p>
                                                    <p className="break-words text-sm leading-6">{item.message}</p>
                                                    <div className={`mt-2 flex items-center gap-1 text-xs ${isMine ? "text-[#FAF6F0]" : "text-[#6E5D4F]"}`}>
                                                        <span>{new Date(item.createdAt).toLocaleString()}</span>
                                                        <span className="ml-2 flex items-center gap-0.5">
                                                            {isMine ? (
                                                                <>
                                                                    <svg className="h-3.5 w-3.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    Sent
                                                                </>
                                                            ) : (
                                                                "Received"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* INPUT FORM */}
                        <form onSubmit={sendMessage} className="flex gap-3 border-t border-[#E6DCCF] bg-white p-5">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder={selectedUserId ? "Type your reply..." : "Select a user first..."}
                                disabled={sending || !selectedUserId}
                                className="flex-1 rounded-xl border border-[#E6DCCF] bg-[#FAF6F0] px-5 py-3.5 text-[#3D2314] outline-none transition focus:border-[#8B5A2B] focus:ring-4 focus:ring-[#FAF6F0] disabled:cursor-not-allowed disabled:bg-slate-100"
                            />

                            <button
                                type="submit"
                                disabled={sending || !selectedUserId || !message.trim()}
                                className="flex items-center gap-2 rounded-xl bg-[#8B5A2B] px-8 py-3.5 font-bold text-white transition hover:bg-[#724820] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {sending ? (
                                    <span>Sending...</span>
                                ) : (
                                    <>
                                        <span>Send</span>
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default ProviderMessages;