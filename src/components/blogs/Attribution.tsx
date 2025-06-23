import { Stack, Typography } from "@mui/material";
import { memo, type FC } from "react";

export const Attribution: FC = memo(() => {
  return (
    <Stack spacing={1}>
      <Typography
        variant="h5"
        component="div"
      >
        {`ข้อมูลเว็ปไซต์`}
      </Typography>
      <Typography>
        {`เว็ปไซต์จัดทำให้เป็นสื่อการสอนกลุ่มสารถการเรียนคณิตาศาสตร์ โรงเรียนอยุธยาวิทยาลัย`}
      </Typography>
      <Typography fontWeight={700}>
        {`พัฒนาและปรับปรุงโดย`}
      </Typography>
      <Typography>
        {`คุณครูชุติมา ประภัสสรพิทยา และ`}
      </Typography>
      <Typography>{`นายธนกร พุทธรักษา`}</Typography>
      <Typography>
        {`(แก้ไขครั้งล่าสุดเมื่อ: 19 มิถุนายน พ.ศ. 2568)`}
      </Typography>
    </Stack>
  );
});
