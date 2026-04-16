import React from 'react';

const SnapGainLogo = () => (
  <div className="flex items-center justify-center"> {/* Ensure the wrapper is also centered if it had flex properties */}
    <img 
      src="https://auhtwkvwbgvekvwctcaj.supabase.co/storage/v1/object/public/public-assets/SNAP%20GAIN%20COM%20ROBO%20LOGOsem%20back.png" 
      alt="SnapGain Logo" 
      className="h-24 sm:h-28 w-auto" // Increased size for larger and proportional display
    />
  </div>
);

export default SnapGainLogo;