import React, { useState, useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegisterMode] = useState(false);
  const [nombre, setNombre] = useState('');

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
    } catch {
      // Error is handled by the auth context
    }
  };



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
            <div className="w-full flex-auto grid content-center justify-center">
              <Button
                type="submit"
                label={isLoading ? 'Procesando...' : (isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión')}
                disabled={isLoading}
                className="w-full bg-red-600 border-red-600 hover:bg-red-700"
                loading={isLoading}
              />
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};