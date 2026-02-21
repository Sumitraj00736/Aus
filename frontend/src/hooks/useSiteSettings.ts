import { useEffect, useState } from 'react';
import { apiRequest } from '../lib/api';

export const useSiteSettings = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    apiRequest('/public/settings')
      .then((data) => setSettings(data))
      .catch(() => undefined);
  }, []);

  return settings;
};
