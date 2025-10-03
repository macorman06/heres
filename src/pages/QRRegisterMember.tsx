// src/pages/QRRegisterMember.tsx

import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import '../styles/QRRegisterMember.css';
import { seccionOptions } from '../types/options.ts';
import { FormDataQRMember, FormErrorsQRMember } from '../types/qrform.types.ts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const QRRegisterMember: React.FC = () => {
  const [formData, setFormData] = useState<FormDataQRMember>({
    firstName: '',
    lastName: '',
    username: '',
    birthDate: '',
    grupo: '',
    seccion: '',
  });

  const [errors, setErrors] = useState<FormErrorsQRMember>({});
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrorsQRMember = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Los apellidos son obligatorios';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'La fecha de nacimiento es obligatoria';
    } else {
      const birthYear = new Date(formData.birthDate).getFullYear();
      const currentYear = new Date().getFullYear();
      if (currentYear - birthYear > 120 || currentYear - birthYear < 5) {
        newErrors.birthDate = 'La fecha de nacimiento no es válida';
      }
    }

    if (!formData.seccion) {
      newErrors.seccion = 'Debes seleccionar una sección';
    }

    if (!consent) {
      newErrors.consent = 'Debes aceptar el tratamiento de datos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/qr/register-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          birthDate: formData.birthDate,
          seccion: formData.seccion,
          consentGiven: true,
          consentDate: new Date().toISOString(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al registrar el miembro');
      }

      // Registro exitoso - NO redirigir
      setSuccess(true);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Error al procesar el registro');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormDataQRMember, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormComplete =
    formData.firstName.trim() !== '' &&
    formData.lastName.trim() !== '' &&
    formData.username.trim() !== '' &&
    formData.birthDate !== '' &&
    formData.seccion !== '' &&
    consent;

  if (success) {
    return (
      <div className="qr-register-page">
        <div className="qr-register-background" />
        <div className="qr-register-overlay">
          <div className="qr-register-container">
            <Card className="qr-register-card success-card">
              <div className="success-content">
                <i
                  className="pi pi-check-circle"
                  style={{ fontSize: '4rem', color: 'var(--green-500)' }}
                />
                <h2>¡Registro Exitoso!</h2>
                <p>Bienvenido/a al Centro Juvenil Juveliber.</p>
                <p>Tu cuenta ha sido creada correctamente.</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-register-page">
      <div className="qr-register-background" />
      <div className="qr-register-overlay">
        <div className="qr-register-container">
          <Card className="qr-register-card">
            <div className="qr-register-header">
              <div className="qr-register-logo">
                <img
                  src="../../public/logos/web-app-manifest-192x192.png"
                  alt="HERES Logo"
                  className="app-logo"
                />
              </div>
              <h1 className="qr-register-title">Registro de Nuevo Miembro</h1>
              <p className="qr-register-subtitle">HERES - Herramienta de Recursos Salesianos</p>
            </div>

            {errorMessage && (
              <div className="qr-register-error">
                <Message severity="error" text={errorMessage} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="qr-register-form">
              <div className="form-field">
                <label htmlFor="firstName" className="required-field">
                  Nombre <span className="required-asterisk">*</span>
                </label>
                <InputText
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={errors.firstName ? 'p-invalid' : ''}
                  placeholder="Tu nombre"
                  disabled={loading}
                />
                {errors.firstName && <small className="p-error">{errors.firstName}</small>}
              </div>

              <div className="form-field">
                <label htmlFor="lastName" className="required-field">
                  Apellidos <span className="required-asterisk">*</span>
                </label>
                <InputText
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={errors.lastName ? 'p-invalid' : ''}
                  placeholder="Tus apellidos"
                  disabled={loading}
                />
                {errors.lastName && <small className="p-error">{errors.lastName}</small>}
              </div>

              <div className="form-field">
                <label htmlFor="username" className="required-field">
                  Usuario <span className="required-asterisk">*</span>
                  <span className="field-hint"> (Nombre visible en juegos)</span>
                </label>
                <InputText
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className={errors.username ? 'p-invalid' : ''}
                  placeholder="Tu nombre de usuario"
                  disabled={loading}
                />
                {errors.username && <small className="p-error">{errors.username}</small>}
              </div>

              <div className="form-field">
                <label htmlFor="birthDate" className="required-field">
                  Fecha de Nacimiento <span className="required-asterisk">*</span>
                </label>
                <InputText
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => handleInputChange('birthDate', e.target.value)}
                  className={errors.birthDate ? 'p-invalid' : ''}
                  max={new Date().toISOString().split('T')[0]}
                  disabled={loading}
                />
                {errors.birthDate && <small className="p-error">{errors.birthDate}</small>}
              </div>

              <div className="form-field">
                <label htmlFor="seccion" className="required-field">
                  Sección <span className="required-asterisk">*</span>
                </label>
                <Dropdown
                  id="seccion"
                  value={formData.seccion}
                  options={seccionOptions}
                  onChange={(e) => handleInputChange('seccion', e.value)}
                  placeholder="Selecciona tu sección"
                  className={errors.seccion ? 'p-invalid' : ''}
                  disabled={loading}
                />
                {errors.seccion && <small className="p-error">{errors.seccion}</small>}
              </div>

              <div className="consent-field">
                <div className="consent-checkbox">
                  <Checkbox
                    inputId="consent"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.checked || false);
                      if (errors.consent) {
                        setErrors((prev) => ({ ...prev, consent: undefined }));
                      }
                    }}
                    className={errors.consent ? 'p-invalid' : ''}
                    disabled={loading}
                  />
                  <label htmlFor="consent" className="consent-label">
                    Acepto el tratamiento de mis datos personales conforme a la{' '}
                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                      política de privacidad
                    </a>
                    <span className="required-asterisk"> *</span>
                  </label>
                </div>
                {errors.consent && <small className="p-error">{errors.consent}</small>}
              </div>

              <div className="privacy-notice">
                <i className="pi pi-info-circle" />
                <p>
                  <strong>Protección de datos:</strong> Tus datos serán utilizados únicamente para
                  gestionar tu participación en las actividades del centro juvenil. Puedes solicitar
                  la eliminación de tus datos en cualquier momento.
                </p>
              </div>

              <div className="form-actions">
                <Button
                  type="submit"
                  label={loading ? 'Registrando...' : 'Registrarme'}
                  icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'}
                  className={`qr-register-button ${loading ? 'qr-register-button-loading' : ''}`}
                  disabled={loading || !isFormComplete}
                />
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};
