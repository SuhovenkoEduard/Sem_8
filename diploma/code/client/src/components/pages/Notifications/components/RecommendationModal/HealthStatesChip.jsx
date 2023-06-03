import * as React from "react";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export const HealthStatesChip = ({
  healthStatesOptions,
  healthStates,
  setHealthStates,
}) => {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setHealthStates(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-multiple-chip-label">Назначения</InputLabel>
      <Select
        labelId="demo-multiple-chip-label"
        id="demo-multiple-chip"
        multiple
        value={healthStates}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Назначения" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => {
              const selectedHealthState = healthStatesOptions.find(
                ({ docId }) => docId === value
              );
              if (!selectedHealthState) {
                return null;
              }
              return <Chip key={value} label={selectedHealthState.title} />;
            })}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {healthStatesOptions.map((healthState) => (
          <MenuItem key={healthState.docId} value={healthState.docId}>
            {healthState.title}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
