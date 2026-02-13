"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import BookmarkPage from "@/components/BookmarkPage";

export default function Home() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <button
          onClick={loginWithGoogle}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return <BookmarkPage session={session} logout={logout} />;
}
