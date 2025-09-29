// components/news/NewsCard.tsx
import React from 'react';
import { Card } from 'primereact/card';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category?: string;
  link: string;
  image?: string;
}

interface NewsCardProps {
  news: NewsItem;
  onClick?: (news: NewsItem) => void;
}

export const NewsCard: React.FC<NewsCardProps> = ({ news, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(news);
    } else {
      window.open(news.link, '_blank');
    }
  };

  const header = news.image && (
    <img
      alt={news.title}
      src={news.image}
      className="w-full h-48 object-cover rounded-t-lg"
    />
  );

  const footer = (
    <div className="flex justify-between items-center pt-4">
      <div className="flex items-center space-x-2">
        <i className="pi pi-calendar text-gray-500 text-sm" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {formatDate(news.date)}
        </span>
      </div>
      <Button
        icon="pi pi-external-link"
        className="p-button-text p-button-sm"
        onClick={handleCardClick}
        tooltip="Leer más"
        tooltipOptions={{ position: 'top' }}
      />
    </div>
  );

  return (
    <Card
      title={news.title}
      subTitle={news.category}
      footer={footer}
      header={header}
      className="w-full h-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3 leading-relaxed">
        {news.excerpt}
      </p>
      {news.category && (
        <Badge
          value={news.category}
          severity="info"
          className="mt-3"
        />
      )}
    </Card>
  );
};
