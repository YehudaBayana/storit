import React, { useState } from "react";
import { Card, Stack, Title, Text, Input, Button, Flex, PasswordInput } from "@mantine/core";
import { useRegister } from "../../query/useAuth";

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: register } = useRegister();

  const handleSubmit = () => {
    register({ email, password });
  };

  return (
    <Card variant="interactive">
      <Stack gap="lg">
        <Stack gap="sm">
          <Title order={2}>Create Account</Title>
          <Text>Get started with your new account</Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Input
            id="register-email-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="you@example.com"
          />

          <PasswordInput
            id="register-password-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="••••••••"
          />
          <Button type="submit" variant="primary">
            Create Account
          </Button>
        </form>

        <Flex align="center" justify="center" gap="xs">
          <Text>Already have an account?</Text>
          <Button variant="outline" size="sm" onClick={onSwitchToLogin}>
            Sign in
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};
