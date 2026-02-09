"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Page() {
  const [form, setForm] = useState({ name: "", file: null });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, file } = form;
    if (!name || !file) {
      alert("Name and image required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post("/api/users", formData);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-white">
      <h1 className="text-xl font-semibold mb-6">Add User</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Name */}
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="border border-white bg-transparent px-3 py-2 outline-none"
        />

        {/* File */}
        <input
          type="file"
          name="file"
          accept="image/*"
          onChange={handleChange}
          className="text-sm"
        />

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="border border-white py-2 hover:bg-white hover:text-black transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add User"}
        </button>
      </form>
    </div>
  );
}
