import { Button, useTheme } from "@heroui/react";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme("light");

  return (
    <div className="flex gap-2">
      <Button onPress={() => setTheme("light")}>
        Light
      </Button>
      <Button onPress={() => setTheme("dark")}>
        Dark
      </Button>
      <Button onPress={() => setTheme("system")}>
        System
      </Button>
      <Button onPress={() => setTheme("brutalism-light")}>
        Brutalism Light
      </Button>
      <span className="text-sm opacity-70">Current: {theme}</span>
    </div>
  );
}
