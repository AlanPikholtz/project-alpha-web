"use client";

import { useRouter } from "next/navigation";
import { useAuthenticateMutation } from "@/lib/auth/api";
import { saveSessionData } from "@/lib/auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [authenticate, { isLoading }] = useAuthenticateMutation();

  const handleLogin = async (data: FormData) => {
    try {
      const username = data.get("username") as string;
      const password = data.get("password") as string;

      const session = await authenticate({
        username,
        password,
      }).unwrap();
      dispatch(saveSessionData(session));

      // Redirect
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="space-y-3" action={handleLogin}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <div className="w-full">
          <div>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                name="username"
                placeholder="Enter your email address"
                defaultValue={"alan.antar"}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                name="password"
                type="password"
                placeholder="Enter password"
                required
                minLength={6}
                defaultValue={"Aluete100"}
              />
            </div>
          </div>
        </div>
        {/* <input type="hidden" name="redirectTo" value={callbackUrl} /> */}
        <button
          className="mt-4 w-full text-white p-4 bg-black rounded"
          disabled={isLoading}
        >
          Ingresar
        </button>
      </div>
    </form>
  );
}
