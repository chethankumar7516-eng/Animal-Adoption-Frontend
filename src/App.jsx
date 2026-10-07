import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";

import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import UserDashboard from "./pages/user/UserDashboard";
import UserMessages from "./pages/user/UserMessages";

import ProviderLogin from "./pages/provider/ProviderLogin";
import ProviderRegister from "./pages/provider/ProviderRegister";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderMessages from "./pages/provider/ProviderMessages";
import ProviderAddPet from "./pages/provider/ProviderAddPet";
import ProviderPets from "./pages/provider/ProviderPets";
import UserPets from "./pages/user/UserPets";
import ProviderRequests from "./pages/provider/ProviderRequests";
import About from "./pages/About";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Home */}
                <Route path="/" element={<Home />} />

                {/* User */}
                <Route
                    path="/user/login"
                    element={<UserLogin />}
                />

                <Route
                    path="/user/register"
                    element={<UserRegister />}
                />

                <Route
                    path="/user/dashboard"
                    element={<UserDashboard />}
                />

                <Route
                    path="/user/messages"
                    element={<UserMessages />}
                />

                {/* Provider */}
                <Route
                    path="/provider/login"
                    element={<ProviderLogin />}
                />

                <Route
                    path="/provider/register"
                    element={<ProviderRegister />}
                />

                <Route
                    path="/provider/dashboard"
                    element={<ProviderDashboard />}
                />

                <Route
                    path="/provider/messages"
                    element={<ProviderMessages />}
                />

                {/* Unknown route */}
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
                <Route
    path="/provider/pets/add"
    element={<ProviderAddPet to="/provider/pets/add"/>}
/>

<Route
    path="/provider/requests"
    element={<ProviderRequests />}
/>

<Route
    path="/provider/pets"
    element={<ProviderPets to="/provider/pets" />}
/>

<Route
    path="/user/pets"
    element={<UserPets />}
/>

<Route 
    path="/about"
    element={<About />}
    />
            </Routes>
        </BrowserRouter>
    );
}

export default App;