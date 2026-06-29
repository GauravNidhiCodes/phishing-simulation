"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft } from "lucide-react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/Button";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("EMPLOYEE");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) setRole(data.user.role);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) router.push("/auth/login");
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCancel = () =>
    router.push(role === "EMPLOYEE" ? "/learning" : "/admin/dashboard");

  return (
    <AuthLayout
      title="Sign out?"
      subtitle="You'll need to sign back in to access the console."
    >
      <div className="space-y-3">
        <Button
          onClick={handleLogout}
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
          iconRight={!loading && <LogOut size={16} />}
        >
          Sign out
        </Button>
        <Button
          onClick={handleCancel}
          variant="secondary"
          size="lg"
          className="w-full"
          icon={<ArrowLeft size={16} />}
        >
          Stay signed in
        </Button>
      </div>
    </AuthLayout>
  );
}
