import React, { useState } from "react";
import { useLogin } from "../../query/useAuth";
import { Card, Stack, Heading, Text, Form, FormField, Input, Button, Flex } from "@/components/ui";

interface LoginProps {
  onSwitchToRegister: () => void;
  dataHook?: string;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister, dataHook }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login } = useLogin();

  const handleSubmit = () => {
    login({ email, password });
  };

  return (
    <Card variant="bordered">
      <Stack gap={"lg"}>
        <Stack gap={"md"}>
          <Heading>Welcome Back</Heading>
          <Text>Please enter your details to sign in</Text>
        </Stack>

        <Form onSubmit={handleSubmit}>
          <FormField label="Email">
            <Input
              id="login-email-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Password">
            <Input
              id="login-password-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
            />
          </FormField>

          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </Form>

        <Flex align="center" justify="center" gap={"xs"}>
          <Text>Do not have an account?</Text>
          <Button variant="secondary" size="sm" onClick={onSwitchToRegister}>
            Sign up
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};
