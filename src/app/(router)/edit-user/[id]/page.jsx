"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";

export default function Page() {
  const [existingProfile, setExistingProfile] = useState(null);
  const [form, setForm] = useState({ name: "", file: null });

  const { id } = useParams();
  const router = useRouter();

  const fetchUser = async () => {
    const res = await axios.get(`/api/users/${id}`);
    setForm({ name: res.data.name, file: null });
    setExistingProfile(res.data.profile);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append("name", form.name);
    if (form.file) fd.append("file", form.file);

    await axios.put(`/api/users/${id}`, fd);
    router.push("/");
  };

  if (!form.name && !existingProfile) {
    return (
      <p className="text-center mt-10 text-white">
        Loading...
      </p>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 text-white">
      <h2 className="text-xl font-semibold mb-6">Edit User</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <div className="flex flex-col gap-1">
          <label className="text-sm">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="border border-white bg-transparent px-3 py-2 outline-none"
          />
        </div>

        {/* Existing Image */}
        {existingProfile && (
          <div className="flex justify-center">
            <Image
              src={`/uploads/${existingProfile}`}
              alt="user-profile"
              width={100}
              height={100}
              className="rounded"
            />
          </div>
        )}

        {/* File input */}
        <div className="flex flex-col gap-1">
          <label className="text-sm">Change Profile</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            onChange={handleChange}
            className="text-sm"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-4 border border-white py-2 hover:bg-white hover:text-black transition"
        >
          Update
        </button>
      </form>
    </div>
  );
}
