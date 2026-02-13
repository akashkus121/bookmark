"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

export default function BookmarkPage({ session, logout }: any) {
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  // 🔹 Fetch function
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setBookmarks(data || []);
    }
  };

  // 🔹 Initial fetch
  useEffect(() => {
  if (session?.user) {
    fetchBookmarks();
  }
}, [session]);


  // 🔹 Polling fallback (every 5 sec)
  // 🔹 Realtime subscription
useEffect(() => {
  if (!session?.user) return;

  const channel = supabase
    .channel("bookmarks-channel")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "bookmarks",
        filter: `user_id=eq.${session.user.id}`, // VERY IMPORTANT
      },
      (payload) => {
        console.log("Realtime event:", payload);

        if (payload.eventType === "INSERT") {
          setBookmarks((prev) => {
            if (prev.find((b) => b.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        }

        if (payload.eventType === "DELETE") {
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== payload.old.id)
          );
        }
      }
    )
    .subscribe((status) => {
      console.log("Realtime status:", status);
    });

  return () => {
    supabase.removeChannel(channel);
  };
}, [session]);


  // 🔹 Sync between browser tabs (instant)


  // 🔹 Add Bookmark
  const addBookmark = async () => {
    if (!title || !url) return;

    const formattedUrl =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `https://${url}`;

    const { data, error } = await supabase
      .from("bookmarks")
      .insert({
        title,
        url: formattedUrl,
        user_id: session.user.id,
      })
      .select();

    if (!error && data) {
      setBookmarks((prev) => [data[0], ...prev]);
      localStorage.setItem("bookmark-updated", Date.now().toString());
      setTitle("");
      setUrl("");
    }
  };

  // 🔹 Delete Bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id);

    if (!error) {
      setBookmarks((prev) => prev.filter((b) => b.id !== id));
      localStorage.setItem("bookmark-updated", Date.now().toString());
    }
  };

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (!error) {
    window.location.href = "/"; // or your login page
  }
};

  return (
    <div className="p-10 max-w-xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">My Bookmarks</h1>
        <button onClick={handleLogout} className="text-red-500">
          Logout
        </button>
      </div>

      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          className="border p-2 flex-1"
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={addBookmark}
          className="bg-green-600 text-white px-4"
        >
          Add
        </button>
      </div>

      <ul className="space-y-3">
        {bookmarks.map((bm) => (
          <li key={bm.id} className="border p-3 rounded">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{bm.title}</p>
                <a
                  href={bm.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 text-sm break-all"
                >
                  {bm.url}
                </a>
              </div>
              <button
                onClick={() => deleteBookmark(bm.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
