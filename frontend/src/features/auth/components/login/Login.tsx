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
    <Card variant="elevated" padding="lg" dataHook={dataHook}>
      <Stack gap={6}>
        <Stack gap={1} align="center">
          <Heading level={2} size="2xl" align="center" dataHook="login-heading">
            Welcome Back
          </Heading>
          <Text variant="body-sm" color="muted" align="center">
            Please enter your details to sign in
          </Text>
        </Stack>

        <Form onSubmit={handleSubmit} gap={4} dataHook="login-form">
          <FormField label="Email" htmlFor="login-email-input" required>
            <Input
              id="login-email-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              dataHook="login-email"
            />
          </FormField>

          <FormField label="Password" htmlFor="login-password-input" required>
            <Input
              id="login-password-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
              dataHook="login-password"
            />
          </FormField>

          <Button type="submit" variant="primary" fullWidth dataHook="login-submit-button">
            Sign In
          </Button>
        </Form>

        <Flex align="center" justify="center" gap={1}>
          <Text variant="body-sm" color="muted">
            Do not have an account?
          </Text>
          <Button
            variant="link"
            size="sm"
            onClick={onSwitchToRegister}
            dataHook="login-switch-to-register-button"
          >
            Sign up
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};
