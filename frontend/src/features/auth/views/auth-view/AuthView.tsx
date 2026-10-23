"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Login } from "../../components/login/Login";
import { Register } from "../../components/register/Register";
import { useGetCurrentUser, useLogout } from "../../query/useAuth";
import { Button, Flex, Heading, Stack, Text } from "@/components/ui";

interface AuthViewProps {
  dataHook?: string;
}

export default function AuthView({ dataHook = "auth-view" }: AuthViewProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const router = useRouter();
  const { data, isLoading } = useGetCurrentUser();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    if (data?.user.id) {
      router.push("/");
    }
  }, [data?.user.id, router]);

  if (isLoading) {
    return (
      <Flex as="main" align="center" justify="center" h="screen" dataHook={dataHook}>
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <Flex as="main" align="center" justify="center" h="screen" dataHook={dataHook}>
      {/* Container View toggling between Login and Register */}
      {data?.user ? (
        <Stack gap={4} align="center" dataHook={`${dataHook}-authenticated`}>
          <Heading level={2} size="2xl" align="center">
            You are logged in to {data.user.email}
          </Heading>
          <Button variant="danger" onClick={() => logout()} dataHook={`${dataHook}-logout`}>
            log out
          </Button>
        </Stack>
      ) : isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} dataHook={`${dataHook}-login`} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} dataHook={`${dataHook}-register`} />
      )}
    </Flex>
  );
}
