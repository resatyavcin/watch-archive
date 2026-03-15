"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authWithGoogle } from "@/api/authApi";
import { AppleIcon, AndroidIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { setAuth } from "@/store";
import type { RootState } from "@/store";

const LOGIN_BACKDROP =
  "https://a.ltrbxd.com/resized/alternative-backdrop/6/1/1/2/8/8/tmdb/o2xLxY1LdwBMsrGD9hjIaOrIQm6-1920-1920-1080-1080-crop-000000.jpg";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const accessToken = useSelector((state: RootState) => state.app.auth.accessToken);
  const [showCard, setShowCard] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (accessToken) router.replace("/");
  }, [accessToken, router]);

  const handleGoogleSuccess = async (credential: string) => {
    setError(null);
    setLoading(true);
    try {
      const auth = await authWithGoogle(credential);
      dispatch(setAuth(auth));
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden w-full">
      {/* Backdrop */}
      <img
        src={LOGIN_BACKDROP}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
        fetchPriority="high"
        decoding="async"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"
        aria-hidden
      />

      {/* Content container */}
      <div className="relative z-10 flex min-h-0 flex-1 w-full overflow-hidden">
        {/* Marketing + Başla - slides left when showCard */}
        <div
          className={`flex flex-1 flex-col items-center justify-center gap-4 p-4 pt-32 transition-transform duration-500 ease-out ${
            showCard ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <div className="flex w-full max-w-md flex-col gap-3 text-center">
            <h1 className="scroll-m-20 text-xl font-extrabold tracking-tight text-white text-balance sm:text-3xl">
              İzlediğin filmleri takip et.
              <br />
              İzlemek istediklerini kaydet.
              <br />
              Arkadaşlarına ne iyi söyle.
            </h1>
            <p className="text-sm font-normal leading-relaxed text-white/75">
              Sinema tutkunları için sosyal ağ. iOS, Apple TV ve Android&apos;de
              de mevcut{" "}
              <span className="inline-flex items-center gap-1.5">
                <AppleIcon />
                <AndroidIcon />
              </span>
            </p>
          </div>
          <Button
            size="lg"
            className={`h-12 w-full max-w-xs px-6 text-base bg-[#e67e22] text-white hover:bg-[#d35400] transition-opacity duration-300 ${
              showCard ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
            onClick={() => setShowCard(true)}
          >
            Başla
          </Button>
        </div>

        {/* Glass card - slides in from right */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center p-4 transition-transform duration-500 ease-out ${
            showCard ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="w-full max-w-sm rounded-2xl border border-white/20 bg-white/10 px-6 py-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-xl font-semibold text-white sm:text-2xl">
                  Giriş yapın
                </h2>
                <p className="text-sm text-white/80">
                  Hesabınıza giriş yaparak izleme listenize devam edin
                </p>
              </div>

              <div className="w-full [&>div]:!w-full [&>div]:!justify-center">
                <GoogleLogin
                  onSuccess={(res) => {
                    if (res.credential) handleGoogleSuccess(res.credential);
                  }}
                  onError={() => setError("Google girişi başarısız.")}
                  theme="filled_black"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width={336}
                  containerProps={{ className: "w-full flex justify-center" }}
                />
              </div>
              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}
              {loading && (
                <p className="text-sm text-white/80 text-center">
                  Giriş yapılıyor...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
