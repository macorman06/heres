import React from 'react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { CalendarEvent, getEventTypeColor } from '../../data';

interface ActivityCardProps {
  event: CalendarEvent;
  onMoreOptions?: (eventId: string) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
                                                            event,
                                                            onMoreOptions
                                                          }) => {
  const handleMoreOptions = () => {
    if (onMoreOptions) {
      onMoreOptions(event.id);
    }
  };

  return (
    <div className="border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
      <div className="flex">
        {/* Date and Responsible Section */}
        <div className="flex-shrink-0 text-center mr-4">
          {/* Date */}
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase mb-1">
            {event.date.dayName}
          </div>
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">
            {event.date.day}
          </div>

          {/* Responsible Avatar */}
          <div className="flex justify-center">
            <Avatar
              image={event.responsible.avatar}
              label={event.responsible.name.charAt(0)}
              shape="circle"
              className="border-3 border-white shadow-lg"
              style={{ width: '48px', height: '48px' }}
              title={`Responsable: ${event.responsible.name}`}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-grow">
          <div className="flex items-start justify-between">
            <div className="flex-grow">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  value={event.type}
                  className={`${getEventTypeColor(event.type)} text-white text-xs font-medium px-2 py-1 !flex !items-center !justify-center !leading-none`}
                />
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {event.title}
              </h3>

              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-3">
                <i className="pi pi-clock mr-2 text-gray-500 dark:text-gray-400"></i>
                <span className="mr-4">{event.time}</span>
                <i className="pi pi-map-marker mr-2 text-gray-500 dark:text-gray-400"></i>
                <span>{event.location}</span>
              </div>

              {/* Participants */}
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Participantes:</span>
                {event.participants.slice(0, 4).map((participant, idx) => (
                  <Avatar
                    key={idx}
                    image={participant.avatar}
                    label={participant.avatar ? undefined : participant.name.charAt(0)}
                    shape="circle"
                    className={`${participant.avatar ? '' : 'bg-red-500 text-white'} text-xs cursor-pointer border-2 border-white shadow-sm`}
                    style={{ width: '24px', height: '24px' }}
                    title={participant.name}
                  />
                ))}
                {event.participants.length > 4 && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                    +{event.participants.length - 4} más
                  </span>
                )}
              </div>
            </div>

            {/* Badge Section */}
            <div className="flex-shrink-0 ml-4 flex flex-row items-center space-x-2">
              <Badge
                value={event.badge}
                severity="info"
                className="bg-blue-100 text-blue-800 !flex !items-center !justify-center !leading-none"
              />
              <Button
                icon="pi pi-angle-down"
                className="p-button-text p-button-sm"
                size="small"
                title="Más opciones"
                onClick={handleMoreOptions}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
