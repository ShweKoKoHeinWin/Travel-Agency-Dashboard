import React from "react";
import { useNavigate } from "react-router";
import { logoutUser } from "~/appwrite/auth";

const PageLayout = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await logoutUser();
        navigate("/sign-in");
    };
    return (
        <div className="min-h-screen flex justify-center items-center gap-8">
            <button
                onClick={handleLogout}
                className="flex justify-center items-center  gap-2 ring-2 p-2 rounded-xl cursor-pointer"
            >
                Logout
                <img
                    src="/assets/icons/logout.svg"
                    alt="logout"
                    className="size-6"
                />
            </button>
            <button
                className="ring-2 p-2 rounded-xl cursor-pointer"
                onClick={() => navigate("/dashboard")}
            >
                Go to Dashboard
            </button>
        </div>
    );
};

export default PageLayout;
