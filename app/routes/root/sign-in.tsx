import { ButtonComponent } from "@syncfusion/ej2-react-buttons";
import React from "react";
import { Link, redirect } from "react-router";
import { loginWithGoogle } from "~/appwrite/auth";
import { account } from "~/appwrite/client";

export async function clientLoader() {
    try{
        const user = await account.get();
        if(user.$id) return redirect('/')
    } catch (e) {
        console.error("err user fetch", e)
    }
}

const SignIn = () => {
    const handleSignIn = async() => {await loginWithGoogle()};
    return (
        <main className="auth">
            <section className="size-full glassmorphism flex-center p-6">
                <div className="sign-in-card">
                    <header className="header">
                        <Link to="/">
                            <img
                                src="/assets/icons/logo.svg"
                                alt="logo"
                                className="size-[30px]"
                            />
                            <h1 className="p-28-bold text-dark-100">
                                Tourvisto
                            </h1>
                        </Link>
                    </header>
                    <article>
                        <h2 className="p-28-semibold text-dark-100 text-center">
                            Start Your Travel Journey
                        </h2>
                        <p className="p-18-regular text-center text-gray-100 !leading-7">
                            Sign in with google to manage destinations,
                            itineraries and user activities with ease.
                        </p>
                    </article>

                    <ButtonComponent
                        iconCss="e-search-icon"
                        className="button-class !h-11 !w-full"
                        onClick={handleSignIn}
                    >
                        <img
                            src="/assets/icons/google.svg"
                            alt=""
                            className="size-5"
                        />
                        <span className="text-white p-18-semibold">
                            Sign in with Google
                        </span>
                    </ButtonComponent>
                </div>
            </section>
        </main>
    );
};

export default SignIn;
