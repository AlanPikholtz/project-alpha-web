"use client";

import { useRouter } from "next/navigation";
import { useAuthenticateMutation } from "@/lib/auth/api";
import { saveSessionData } from "@/lib/auth/authSlice";
import { useAppDispatch } from "@/lib/store/hooks";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  username: z.string().nonempty("Ingrese el nombre de usuario"),
  password: z.string().nonempty("Ingrese la contraseña"),
});

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [authenticate, { isLoading }] = useAuthenticateMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async ({
    username,
    password,
  }: z.infer<typeof formSchema>) => {
    try {
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
    <Form {...form}>
      <form
        className="flex flex-col gap-y-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Contraseña" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" loading={isLoading}>
          Ingresar
        </Button>
      </form>
    </Form>
  );
}
