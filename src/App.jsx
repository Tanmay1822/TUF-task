import { useEffect } from 'react';
import WallCalendar from './components/WallCalendar';
import { MONTH_THEMES } from './data/themes';

function App() {
  // Preload all 12 background images on mount
  useEffect(() => {
    Object.values(MONTH_THEMES).forEach(theme => {
      if (theme.bgImage) {
        const img = new Image();
        img.src = theme.bgImage;
      }
    });
  }, []);

  return <WallCalendar />;
}

export default App;
