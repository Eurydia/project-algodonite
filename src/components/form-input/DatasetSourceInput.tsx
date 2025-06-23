import { OutlinedInput } from "@mui/material";
import {
  memo,
  useCallback,
  type ChangeEvent,
  type FC,
} from "react";

type Props = {
  value: string;
  onChange: (v: string) => unknown;
};
export const DatasetSourceInput: FC<Props> = memo(
  ({ value, onChange }) => {
    const handleChange = useCallback(
      ({
        target: { value },
      }: ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >) => onChange(value),
      [onChange]
    );
    return (
      <OutlinedInput
        placeholder="10, 20, 10, 30, 90"
        multiline
        minRows={6}
        value={value}
        onChange={handleChange}
        slotProps={{
          input: {
            sx: { fontFamily: "monospace" },
            autoCapitalize: "off",
            autoComplete: "off",
            autoCorrect: "off",
            autoSave: "off",
          },
        }}
      />
    );
  }
);
