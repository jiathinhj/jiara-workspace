import { memo } from "react";
import { useDarkMode } from "../Context/ThemeContext";
import { Switch } from "antd";

export const DarkModeToggle = memo(function DarkModeToggle() {
  const { isDark, themeToggler }: any = useDarkMode();

  return (
    <Switch
      checkedChildren={"🌙"}
      unCheckedChildren={"🔆"}
      defaultChecked={isDark}
      onClick={themeToggler}
    />
  );
});
