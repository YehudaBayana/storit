import React, { useState } from "react";
import { useRegister } from "../../query/useAuth";
import { Card, Stack, Heading, Text, Form, FormField, Input, Button, Flex } from "@/components/ui";

interface RegisterProps {
  onSwitchToLogin: () => void;
  dataHook?: string;
}

export const Register: React.FC<RegisterProps> = ({
  onSwitchToLogin,
  dataHook = "auth-register-view",
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: register } = useRegister();

  const handleSubmit = () => {
    register({ email, password });
  };

  return (
    <Card variant="elevated" padding="lg" dataHook={dataHook}>
      <Stack gap={6}>
        <Stack gap={1} align="center">
          <Heading level={2} size="2xl" align="center" dataHook="register-heading">
            Create Account
          </Heading>
          <Text variant="body-sm" color="muted" align="center">
            Get started with your new account
          </Text>
        </Stack>

        <Form onSubmit={handleSubmit} gap={4} dataHook={`${dataHook}-form`}>
          <FormField label="Email" htmlFor="register-email-input" required>
            <Input
              id="register-email-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
              dataHook={`${dataHook}-email`}
            />
          </FormField>

          <FormField label="Password" htmlFor="register-password-input" required>
            <Input
              id="register-password-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
              dataHook={`${dataHook}-password`}
            />
          </FormField>

          <Button type="submit" variant="primary" fullWidth dataHook={`${dataHook}-submit-button`}>
            Create Account
          </Button>
        </Form>

        <Flex align="center" justify="center" gap={1}>
          <Text variant="body-sm" color="muted">
            Already have an account?
          </Text>
          <Button
            variant="link"
            size="sm"
            onClick={onSwitchToLogin}
            dataHook={`${dataHook}-switch-to-login-button`}
          >
            Sign in
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};
