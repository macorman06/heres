// components/news/NewsFeed.tsx
import React from 'react';
import { NewsCard } from './NewsCard';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { useRSSFeed } from '../../hooks/useRSSFeed';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  link: string;
  image?: string;
}

interface NewsFeedProps {
  maxItems?: number;
  showHeader?: boolean;
  showLoadMore?: boolean;
  compact?: boolean;
}

export const NewsFeed: React.FC<NewsFeedProps> = ({
                                                    maxItems = 6,
                                                    showHeader = true,
                                                    showLoadMore = false,
                                                    compact = false
                                                  }) => {
  // Usar el hook RSS para obtener noticias reales
  const { items, loading, error } = useRSSFeed('https://www.salesianos.es/noticias/feed/');

  // Transformar items RSS a formato NewsItem
  const transformedNews: NewsItem[] = items.slice(0, maxItems).map((item, index) => ({
    id: item.guid || `news-${index}`,
    title: item.title,
    excerpt: item.description?.replace(/<[^>]*>/g, '').substring(0, 150) + '...' || '',
    date: item.pubDate || new Date().toISOString(),
    category: extractCategory(item.description),
    link: item.link,
    image: extractImage(item.description) || `/images/salesianos-${(index % 3) + 1}.jpg`
  }));

  // Función auxiliar para extraer categoría del contenido
  const extractCategory = (description: string | undefined): string => {
    if (!description) return 'General';
    if (description.includes('juvenil') || description.includes('jóvenes')) return 'Pastoral Juvenil';
    if (description.includes('educación') || description.includes('escuela')) return 'Educación';
    if (description.includes('misiones')) return 'Misiones';
    if (description.includes('centenario') || description.includes('años')) return 'Historia';
    if (description.includes('social') || description.includes('violencia')) return 'Social';
    return 'Noticias';
  };

  // Función auxiliar para extraer imagen del contenido
  const extractImage = (description: string | undefined): string | undefined => {
    if (!description) return undefined;
    const imgMatch = description.match(/<img[^>]+src="([^">]+)"/);
    return imgMatch ? imgMatch[1] : undefined;
  };

  const handleNewsClick = (newsItem: NewsItem) => {
    window.open(newsItem.link, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <ProgressSpinner style={{ width: '50px', height: '50px' }} />
        <span className="ml-3 text-gray-600 dark:text-gray-300">Cargando noticias...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Message
        severity="error"
        text={error}
        className="w-full"
      />
    );
  }

  return (
    <div className={compact ? '' : 'bg-gray-50 dark:bg-gray-900 min-h-screen p-6'}>
      <div className={compact ? '' : 'max-w-7xl mx-auto'}>
        {/* Header */}
        {showHeader && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/logos/favicon-96x96.png"
                alt="Salesianos"
                className="w-8 h-8 rounded-md"
              />
              <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Noticias Salesianos
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Últimas noticias de la Inspectoría Salesiana Santiago el Mayor
            </p>
          </div>
        )}

        {/* News Grid */}
        <div className={`grid gap-6 ${
          compact
            ? 'grid-cols-1 lg:grid-cols-2'
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {transformedNews.map((newsItem) => (
            <div key={newsItem.id} className="flex">
              <NewsCard
                news={newsItem}
                onClick={handleNewsClick}
              />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {showLoadMore && (
          <div className="flex justify-center mt-8">
            <Button
              label="Ver más noticias"
              icon="pi pi-external-link"
              className="p-button-outlined"
              onClick={() => window.open('https://www.salesianos.es/noticias/', '_blank')}
            />
          </div>
        )}
      </div>
    </div>
  );
};
