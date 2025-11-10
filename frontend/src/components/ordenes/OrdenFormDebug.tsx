"use client";

import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

interface OrdenFormDebugProps {
  open: boolean;
  onClose: () => void;
}

export default function OrdenFormDebug({ open, onClose }: OrdenFormDebugProps) {
  console.log("🔍 OrdenFormDebug - open:", open); // ← Esto debe aparecer en consola
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>🧪 FORMULARIO DEBUG</DialogTitle>
      <DialogContent>
        <Typography variant="h6" color="primary">
          ¡Si ves esto, el formulario funciona!
        </Typography>
        <Typography>
          Estado open: {open ? "TRUE" : "FALSE"}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}