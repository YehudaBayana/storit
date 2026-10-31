import React, { useState } from "react";
import { useRegister } from "../../query/useAuth";
import { Card, Stack, Heading, Text, Form, FormField, Input, Button, Flex } from "@/components/ui";

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
      <Stack gap={"lg"}>
        <Stack gap={"sm"}>
          <Heading>Create Account</Heading>
          <Text>Get started with your new account</Text>
        </Stack>

        <Form onSubmit={handleSubmit}>
          <FormField label="Email">
            <Input
              id="register-email-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              placeholder="you@example.com"
            />
          </FormField>

          <FormField label="Password">
            <Input
              id="register-password-input"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              placeholder="••••••••"
            />
          </FormField>

          <Button type="submit" variant="primary">
            Create Account
          </Button>
        </Form>

        <Flex align="center" justify="center" gap={"xs"}>
          <Text>Already have an account?</Text>
          <Button variant="outline" size="sm" onClick={onSwitchToLogin}>
            Sign in
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};
