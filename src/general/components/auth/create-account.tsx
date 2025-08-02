"use client";
import { useState } from "react";
import { api } from "@/lib/api";

export default function CreateAccount() {
  const [form, setForm] = useState({ full_name: "", email: "", password: "" });
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify(form),
      });
      setMessage(
        "Registration successful! Check your email for verification link."
      );
    } catch (err: any) {
      setMessage(
        typeof err?.message === "string" ? err.message : "Registration failed"
      );
    }
  };

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded"
        >
          Register
        </button>
      </form>
      {message && <p className="text-sm text-red-500">{message}</p>}
    </div>
  );
}
