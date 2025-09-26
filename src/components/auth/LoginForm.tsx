import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { useAuth } from '../../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Credenciales incorrectas. Intenta de nuevo.');
    }
  };

  const demoCredentials = [
    { email: 'emmanuel.lokossou@juvenliber.es', role: 'Director' },
    { email: 'david.corpas@juvenliber.es', role: 'Animador' },
    { email: 'olaya.corral@juvenliber.es', role: 'Coordinador' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0">
          <div className="text-center mb-8">
            <img 
              src="/salesianos_sticker.png" 
              alt="Salesianos" 
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">HERES</h1>
            <p className="text-gray-600">Herramienta de Recursos Salesianos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Message severity="error" text={error} className="w-full" />
            )}

            <div className="mt-8 pt-4 border-t border-gray-200">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.email@juvenliber.es"
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <Password
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                feedback={false}
                toggleMask
                disabled={isLoading}
              />
            </div>

            <div className="w-full flex justify-center">
              <Button
                type="submit"
                label={isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                loading={isLoading}
                disabled={isLoading}
                className="px-2 py-1 bg-red-600 hover:bg-red-700 border-red-600 text-white w-auto"
              />
            </div>

          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">
              <strong>Demo - Credenciales de prueba:</strong>
            </p>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setEmail(cred.email);
                    setPassword('password');
                  }}
                  className="w-full text-left p-2 text-xs bg-gray-50 hover:bg-gray-100 rounded border transition-colors"
                  disabled={isLoading}
                >
                  <div className="font-medium">{cred.email}</div>
                  <div className="text-gray-500">{cred.role} • password: password</div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};