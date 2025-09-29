import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [nombre, setNombre] = useState('');
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  
  const { login, register, isLoading, error, clearError } = useAuth();

  useEffect(() => {
    // Clear error when switching modes
    clearError();
  }, [isRegisterMode, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email || !password || (isRegisterMode && !nombre)) {
      return;
    }

    try {
      if (isRegisterMode) {
        await register({ nombre, email, password });
      } else {
        await login({ email, password });
      }
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setEmail('');
    setPassword('');
    setNombre('');
    clearError();
  };

  const demoCredentials = [
    { email: 'admin@gecos.com', password: 'admin123', role: 'Superusuario' },
    { email: 'director@gecos.com', password: 'director123', role: 'Director' },
    { email: 'coordinador@gecos.com', password: 'coord123', role: 'Coordinador' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800">
          <div className="text-center mb-8">
            <img 
              src="/logos/favicon-96x96.png" 
              alt="HERES Logo" 
              className="w-16 h-16 mx-auto mb-4 rounded-md"
            />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">HERES</h1>
            <p className="text-gray-600 dark:text-gray-300">Herramienta de Recursos Salesianos</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {isRegisterMode ? 'Crear cuenta de administrador' : 'Iniciar sesión'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Message 
                severity="error" 
                text={error} 
                className="w-full" 
              />
            )}

            {isRegisterMode && (
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre Completo
                </label>
                <InputText
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre completo"
                  disabled={isLoading}
                  className="w-full"
                  required
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Correo Electrónico
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                disabled={isLoading}
                className="w-full"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Contraseña
              </label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                feedback={isRegisterMode}
                toggleMask
                disabled={isLoading}
                className="w-full"
                inputClassName="w-full"
                required
              />
            </div>

            <Button
              type="submit"
              label={isLoading ? 'Procesando...' : (isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión')}
              disabled={isLoading}
              className="w-full bg-red-600 border-red-600 hover:bg-red-700"
              loading={isLoading}
            />
          </form>

          <Divider />

          <div className="text-center">
            <Button
              label={isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión' : '¿Primera vez? Crear cuenta de administrador'}
              className="p-button-text p-button-sm text-red-600 dark:text-red-400"
              onClick={toggleMode}
              disabled={isLoading}
            />
          </div>

          {!isRegisterMode && (
            <>
              <Divider />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Cuentas de prueba:
                  </p>
                  <Button
                    icon="pi pi-question-circle"
                    className="p-button-text p-button-sm"
                    onClick={() => setShowSetupGuide(!showSetupGuide)}
                    tooltip="Guía de configuración inicial"
                  />
                </div>
                
                {demoCredentials.map((cred, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setEmail(cred.email);
                      setPassword(cred.password);
                    }}
                    className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
                    disabled={isLoading}
                    type="button"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-100">{cred.email}</div>
                        <div className="text-gray-500 dark:text-gray-400">{cred.role}</div>
                      </div>
                      <div className="text-xs text-gray-400 dark:text-gray-500">
                        Click para usar
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {showSetupGuide && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                    <i className="pi pi-info-circle mr-2" />
                    Configuración Inicial
                  </h4>
                  <div className="text-sm text-blue-700 dark:text-blue-400 space-y-2">
                    <p><strong>1.</strong> Usa "Crear cuenta" para registrar el primer superusuario</p>
                    <p><strong>2.</strong> Con la cuenta de superusuario, crea cuentas adicionales</p>
                    <p><strong>3.</strong> Asigna roles apropiados a cada usuario</p>
                    <p><strong>4.</strong> Comienza a gestionar miembros y usuarios</p>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    </div>
  );
};