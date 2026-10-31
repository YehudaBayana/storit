"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Flex, Title, Stack, Text } from "@mantine/core";
import { Login } from "../../components/login/Login";
import { Register } from "../../components/register/Register";
import { useGetCurrentUser, useLogout } from "../../query/useAuth";

export default function AuthView() {
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
      <Flex align="center" justify="center">
        <Text>Loading...</Text>
      </Flex>
    );
  }

  return (
    <Flex align="center" justify="center">
      {/* Container View toggling between Login and Register */}
      {data?.user ? (
        <Stack gap="md">
          <Title>You are logged in to {data.user.email}</Title>
          <Button variant="secondary" onClick={() => logout()}>
            log out
          </Button>
        </Stack>
      ) : isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </Flex>
  );
}
