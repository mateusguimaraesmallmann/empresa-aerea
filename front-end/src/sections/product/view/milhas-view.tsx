import Typography from '@mui/material/Typography';
import { _products } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------


export function MilhasView() {

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Milhas
      </Typography>

    </DashboardContent>
  );
  
}
