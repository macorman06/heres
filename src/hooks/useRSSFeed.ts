// hooks/useRSSFeed.ts
import { useState, useEffect } from 'react';

interface RSSItem {
  title: string;
  link: string;
  description?: string;
  pubDate: string;
  guid?: string;
}

interface UseRSSFeedReturn {
  items: RSSItem[];
  loading: boolean;
  error: string | null;
}

export const useRSSFeed = (rssUrl: string): UseRSSFeedReturn => {
  const [items, setItems] = useState<RSSItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRSS = async () => {
      try {
        setLoading(true);
        setError(null);

        // Usar RSS2JSON como proxy CORS
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        const response = await fetch(proxyUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.status !== 'ok') {
          throw new Error(data.message || 'Error fetching RSS feed');
        }

        const parsedItems: RSSItem[] = data.items.map((item: any) => ({
          title: item.title || '',
          link: item.link || '',
          description: item.description || item.content || '',
          pubDate: item.pubDate || new Date().toISOString(),
          guid: item.guid || item.link
        }));

        setItems(parsedItems);
      } catch (err) {
        console.error('Error fetching RSS:', err);
        setError('Error al cargar las noticias. Mostrando contenido de respaldo.');

        // Fallback con datos mock si falla la carga RSS
        setItems([
          {
            title: 'Noticias Salesianos disponibles online',
            link: 'https://www.salesianos.es/noticias/',
            description: 'Visita nuestra web para ver las últimas noticias de la comunidad salesiana.',
            pubDate: new Date().toISOString(),
            guid: 'fallback-1'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (rssUrl) {
      fetchRSS();
    }
  }, [rssUrl]);

  return { items, loading, error };
};
