import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
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
export const DatasetOriginInput: FC<Props> = memo(
  ({ onChange, value }) => {
    const handleChange = useCallback(
      ({
        target: { value },
      }: ChangeEvent<HTMLInputElement>) => onChange(value),
      [onChange]
    );
    return (
      <FormControl>
        <FormLabel>
          <Typography color="textPrimary">{`แหล่งที่มาของข้อมูล`}</Typography>
        </FormLabel>
        <RadioGroup
          row
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value={"0"}
            control={
              <Radio
                disableFocusRipple
                disableRipple
                disableTouchRipple
              />
            }
            label="ประชากร"
          />
          <FormControlLabel
            value={"1"}
            control={<Radio />}
            label="กลุ่มตัวอย่าง"
          />
        </RadioGroup>
      </FormControl>
    );
  }
);
