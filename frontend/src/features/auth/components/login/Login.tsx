import React, { useState } from 'react';
import { Card, Stack, Title, Text, Input, Button, Flex, PasswordInput } from '@mantine/core';
import { useLogin } from '../../query/useAuth';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { mutate: login } = useLogin();

  const handleSubmit = () => {
    login({ email, password });
  };

  return (
    <Card variant="bordered">
      <Stack gap={'lg'}>
        <Stack gap={'md'}>
          <Title>Welcome Back</Title>
          <Text>Please enter your details to sign in</Text>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Input
            id="login-email-input"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            placeholder="you@example.com"
          />

          <PasswordInput
            id="login-password-input"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            placeholder="••••••••"
          />

          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </form>

        <Flex align="center" justify="center" gap={'xs'}>
          <Text>Do not have an account?</Text>
          <Button variant="secondary" size="sm" onClick={onSwitchToRegister}>
            Sign up
          </Button>
        </Flex>
      </Stack>
    </Card>
  );
};
