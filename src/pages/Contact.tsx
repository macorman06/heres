import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

export const Contact: React.FC = () => {
  const contactInfo = [
    {
      title: 'Dirección',
      icon: 'pi pi-map-marker',
      content: 'Calle Salesianos, 123\n28001 Madrid, España',
      color: 'bg-red-500'
    },
    {
      title: 'Teléfono',
      icon: 'pi pi-phone',
      content: '+34 91 123 45 67',
      color: 'bg-blue-500'
    },
    {
      title: 'Email',
      icon: 'pi pi-envelope',
      content: 'info@juvenliber.es',
      color: 'bg-green-500'
    },
    {
      title: 'Horarios',
      icon: 'pi pi-clock',
      content: 'Lunes a Viernes: 16:00 - 20:00\nSábados: 10:00 - 14:00',
      color: 'bg-purple-500'
    }
  ];

  const staff = [
    {
      name: 'Emmanuel Lokossou',
      role: 'Director CJ',
      email: 'emmanuel.lokossou@juvenliber.es',
      phone: '+34 91 123 45 67',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      name: 'Olaya Corral',
      role: 'Coordinadora CJ',
      email: 'olaya.corral@juvenliber.es',
      phone: '+34 91 123 45 68',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    },
    {
      name: 'Fernando Gracia',
      role: 'Coordinador Chiqui',
      email: 'fernando.gracia@juvenliber.es',
      phone: '+34 91 123 45 69',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Información de Contacto</h1>
        <p className="text-red-100 dark:text-red-200">
          Centro Juvenil Salesianos - Conecta con nosotros
        </p>
      </div>

      {/* Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {contactInfo.map((info, index) => (
          <Card key={index} className="border-0 shadow-md bg-white dark:bg-gray-800">
            <div className="text-center">
              <div className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <i className={`${info.icon} text-white text-2xl`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">{info.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">{info.content}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Staff Directory */}
        <Card title="Equipo de Coordinación" className="border-0 shadow-md bg-white dark:bg-gray-800">
          <div className="space-y-4">
            {staff.map((person, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img 
                  src={person.avatar} 
                  alt={person.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 dark:text-gray-100">{person.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{person.role}</p>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <i className="pi pi-envelope mr-2" />
                      {person.email}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                      <i className="pi pi-phone mr-2" />
                      {person.phone}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    icon="pi pi-envelope"
                    size="small"
                    outlined
                    tooltip="Enviar email"
                    onClick={() => window.open(`mailto:${person.email}`)}
                  />
                  <Button
                    icon="pi pi-phone"
                    size="small"
                    severity="success"
                    tooltip="Llamar"
                    onClick={() => window.open(`tel:${person.phone}`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card title="Acciones Rápidas" className="border-0 shadow-md bg-white dark:bg-gray-800">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                <i className="pi pi-question-circle mr-2" />
                ¿Necesitas ayuda?
              </h4>
              <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">
                Consulta nuestras preguntas frecuentes o contacta directamente con el equipo.
              </p>
              <Button
                label="Ver FAQ"
                icon="pi pi-external-link"
                size="small"
                outlined
                className="mr-2"
              />
              <Button
                label="Contactar"
                icon="pi pi-phone"
                size="small"
                className="bg-blue-600 border-blue-600"
              />
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">
                <i className="pi pi-calendar mr-2" />
                Reservar Cita
              </h4>
              <p className="text-sm text-green-600 dark:text-green-400 mb-3">
                Programa una reunión con el equipo de coordinación.
              </p>
              <Button
                label="Reservar Cita"
                icon="pi pi-calendar-plus"
                size="small"
                className="bg-green-600 border-green-600"
              />
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                <i className="pi pi-map mr-2" />
                Cómo Llegar
              </h4>
              <p className="text-sm text-purple-600 dark:text-purple-400 mb-3">
                Encuentra la mejor ruta para llegar al centro juvenil.
              </p>
              <Button
                label="Ver Mapa"
                icon="pi pi-map-marker"
                size="small"
                className="bg-purple-600 border-purple-600"
              />
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <h4 className="font-semibold text-red-800 dark:text-red-300 mb-2">
                <i className="pi pi-exclamation-triangle mr-2" />
                Emergencias
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                Para situaciones urgentes, contacta inmediatamente.
              </p>
              <Button
                label="Contacto de Emergencia"
                icon="pi pi-phone"
                size="small"
                severity="danger"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Map Placeholder */}
      <Card title="Ubicación" className="border-0 shadow-md bg-white dark:bg-gray-800">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-8 text-center">
          <i className="pi pi-map text-4xl text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">Mapa Interactivo</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Aquí se mostraría un mapa interactivo con la ubicación del centro juvenil.
          </p>
          <Button
            label="Abrir en Google Maps"
            icon="pi pi-external-link"
            outlined
          />
        </div>
      </Card>
    </div>
  );
};