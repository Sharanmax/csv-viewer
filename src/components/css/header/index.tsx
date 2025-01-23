import React from "react";
import styles from "./index.module.css";

import { Logo } from "@components/css";
import Box from "@mui/material/Box";

export const Header: React.FC = () => {
  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', py: '16px', bgcolor: 'ButtonShadow'}}>
      CSV Viewer
    </Box>
  );
};
