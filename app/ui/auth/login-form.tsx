"use client";

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useAuthenticateMutation } from "@/app/lib/auth/api";
import { setSession } from "@/app/lib/auth/authSlice";

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [authenticate, { isLoading }] = useAuthenticateMutation();

  const handleLogin = async (data: FormData) => {
    try {
      const email = data.get("email") as string;
      const password = data.get("password") as string;

      console.log(email, password);

      const session = await authenticate({ email, password }).unwrap();
      dispatch(setSession(session));
      // Save cookie for middleware
      document.cookie = `token=${session.accessToken}; path=/`;

      // Redirect
      router.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="space-y-3" action={handleLogin}>
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`mb-3 text-2xl`}>Please log in to continue.</h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                defaultValue={"aupikholtz@gmail.com"}
                required
              />
              {/* <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
                defaultValue={"AUPik*1234"}
              />
              {/* <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" /> */}
            </div>
          </div>
        </div>
        {/* <input type="hidden" name="redirectTo" value={callbackUrl} /> */}
        <button className="mt-4 w-full" disabled={isLoading}>
          Log in
          {/* <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" /> */}
        </button>
      </div>
    </form>
  );
}
