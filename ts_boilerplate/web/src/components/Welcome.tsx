import React from 'react';
import { DEFAULT_THEME, Divider, Paper, Text, Group, Button } from '@mantine/core';

const Welcome: React.FC = () => {
  const theme = DEFAULT_THEME;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent', // Set to transparent to remove background
      }}
    >
      <Paper
        w={350}
        h={400}
        withBorder
        radius="sm"
        style={{ padding: 20, textAlign: 'center', backgroundColor: theme.colors.dark[7] }}
      >
        <Text size="xl" fw={700} style={{ marginBottom: 15 }}>
          Welcome to TS Scripts Boilerplate
        </Text>
        <Divider />
        <Text size="sm" style={{ marginTop: 15, marginBottom: 15 }}>
          This is a simple boilerplate for starting a React project with TypeScript and Mantine v6.
        </Text>
        <Group position="center" style={{ marginTop: 20 }}>
          <Button variant="light" color="teal">
            Get Started
          </Button>
        </Group>
      </Paper>
    </div>
  );
};

export default Welcome;
