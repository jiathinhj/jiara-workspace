import { memo } from "react";
import { useDarkMode } from "../context/theme";
import { Switch } from "antd";

export const DarkModeToggle = memo(function DarkModeToggle() {
  const { isDark, themeToggler }: any = useDarkMode();
  console.log(isDark);

  return (
    <Switch
      checkedChildren={"🌙"}
      unCheckedChildren={"🔆"}
      defaultChecked={isDark}
      onClick={themeToggler}
    />
  );
});