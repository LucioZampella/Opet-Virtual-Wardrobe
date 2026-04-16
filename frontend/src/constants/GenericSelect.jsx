import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function GenericSelect({ label, options, onChange, value, multiple = false }) {
    return (
        <Autocomplete
            multiple={multiple}
            size="small" // <--- Esto hace que el componente sea más compacto
            disablePortal
            options={options || []}
            value={value || (multiple ? [] : null) }
            onChange={(event, newValue) => onChange(newValue)}
            getOptionLabel={(option) => { if (typeof option === String) {
                return option;
            }
                return option.label || option.name || "";
            }
            }
            isOptionEqualToValue={(option, value) => option.id === value.id}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={label}
                    sx={{
                        '& .MuiInputLabel-root': { fontSize: '0.8rem', color: '#6b6258' },
                        '& .MuiOutlinedInput-root': { fontSize: '0.8rem', color: '#e8d5b0' }
                    }}
                />
            )}
            sx={{
                width: '100%',
                backgroundColor: '#221f1c',
                borderRadius: 1,
                '.MuiOutlinedInput-notchedOutline': { borderColor: '#3a3530' }
            }}
        />
    );
}