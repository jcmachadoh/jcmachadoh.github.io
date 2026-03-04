import { Box, Typography } from "@mui/material";

export const ExperienceItem = ({ experience }) => {
    const { cargo, center, dateStart, dateEnd, works } = experience;
    return (
        <Box sx={{ position: 'relative', mb: 6 }}>
            <Box sx={{ position: 'absolute', left: '-42px', top: '5px', width: '20px', height: '20px', bgcolor: 'white', border: '3px solid #2563eb', borderRadius: '50%' }} />
            <Typography variant="h6" color="primary.main" fontWeight="bold">{cargo}</Typography>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>{center} | {dateStart} - {dateEnd}</Typography>
            {works.map((work, item) => <Typography key={item} variant="body2">{work}</Typography>)}
        </Box>
    )
};