import React, { useState, useEffect } from 'react';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import '../styles/QRRegisterMember.css';
import { FormDataQRMember, FormErrorsQRMember } from '../types/qrform.types.ts';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const QRRegisterMember: React.FC = () => {
  const [formData, setFormData] = useState<FormDataQRMember>({
    firstName: '',
    lastName1: '',
    lastName2: '',
    email: '',
    username: '',
    birthDate: '',
    grupo: '',
    seccion: '',
    centro_juvenil: 'CJ Juveliber', // Valor por defecto fijo
  });

  const [errors, setErrors] = useState<FormErrorsQRMember>({});
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [grupoOptions, setGrupoOptions] = useState<{ label: string; value: string }[]>([]);

  // Opciones de Sección
  const seccionOptions = [
    { label: 'CJ', value: 'CJ' },
    { label: 'Chiqui', value: 'Chiqui' },
  ];

  // Actualizar opciones de Grupo según Sección seleccionada
  useEffect(() => {
    if (formData.seccion === 'CJ') {
      setGrupoOptions([
        { label: 'PREAS', value: 'PREAS' },
        { label: 'A1', value: 'A1' },
        { label: 'A2', value: 'A2' },
        { label: 'J1', value: 'J1' },
        { label: 'J2', value: 'J2' },
        { label: 'J3', value: 'J3' },
        { label: 'Animador/a', value: 'Animador/a' },
      ]);
      // Resetear grupo si no es válido para CJ
      if (
        formData.grupo &&
        !['PREAS', 'A1', 'A2', 'J1', 'J2', 'J3', 'Animador/a'].includes(formData.grupo)
      ) {
        setFormData((prev) => ({ ...prev, grupo: '' }));
      }
    } else if (formData.seccion === 'Chiqui') {
      setGrupoOptions([
        { label: '1º y 2º', value: '1º y 2º' },
        { label: '3º', value: '3º' },
        { label: '4º', value: '4º' },
        { label: '5º', value: '5º' },
        { label: '6º', value: '6º' },
        { label: 'Animador/a', value: 'Animador/a' },
      ]);
      // Resetear grupo si no es válido para Chiqui
      if (
        formData.grupo &&
        !['1º y 2º', '3º', '4º', '5º', '6º', 'Animador/a'].includes(formData.grupo)
      ) {
        setFormData((prev) => ({ ...prev, grupo: '' }));
      }
    } else {
      setGrupoOptions([]);
      setFormData((prev) => ({ ...prev, grupo: '' }));
    }
  }, [formData.seccion]);

  const validateForm = (): boolean => {
    const newErrors: FormErrorsQRMember = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    }

    if (!formData.lastName1.trim()) {
      newErrors.lastName1 = 'Los apellidos son obligatorios';
    }

    if (!formData.lastName2.trim()) {
      newErrors.lastName2 = 'Los apellidos son obligatorios';
    }

    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'El correo electrónico no tiene un formato válido';
      }
    }

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (formData.username.length < 4) {
      newErrors.username = 'El nombre de usuario debe tener al menos 4 caracteres';
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

    if (!formData.grupo) {
      newErrors.grupo = 'Debes seleccionar un grupo';
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
      const response = await fetch(`${API_BASE_URL}/register-member`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName1: formData.lastName1,
          lastName2: formData.lastName2,
          email: formData.email,
          username: formData.username,
          birthDate: formData.birthDate,
          seccion: formData.seccion,
          grupo: formData.grupo,
          consentGiven: true,
          consentDate: new Date().toISOString(),
          centro_juvenil: formData.centro_juvenil,
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
    formData.lastName1.trim() !== '' &&
    formData.lastName2.trim() !== '' &&
    formData.email.trim() !== '' &&
    formData.username.trim() !== '' &&
    formData.birthDate !== '' &&
    formData.seccion !== '' &&
    formData.grupo !== '' &&
    consent;

  if (success) {
    return (
      <div className="register-container">
        <Card className="register-card success-card">
          <div className="success-message">
            <i className="pi pi-check-circle" style={{ fontSize: '4rem', color: '#22c55e' }}></i>
            <h2>¡Registro Exitoso!</h2>
            <p>Bienvenido/a a HERES.</p>
            <p>Revisa tu correo para confirmar tu cuenta.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="register-container">
      <Card className="register-card">
        <h1 className="register-title">Registro de Nuevo Miembro</h1>
        <p className="register-subtitle">HERES - Herramienta de Recursos Salesianos</p>

        {errorMessage && (
          <Message severity="error" text={errorMessage} className="error-message-banner" />
        )}

        <form onSubmit={handleSubmit} className="register-form">
          {/* NOMBRE */}
          <div className="form-field">
            <label htmlFor="firstName">Nombre *</label>
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

          {/* APELLIDOS */}
          <div className="form-field">
            <label>Apellidos *</label>
            <div className="apellidos-container">
              {/* PRIMER APELLIDO */}
              <InputText
                id="lastName1"
                value={formData.lastName1}
                onChange={(e) => handleInputChange('lastName1', e.target.value)}
                className={errors.lastName1 ? 'p-invalid' : ''}
                placeholder="Primer apellido"
                disabled={loading}
                style={{ width: '100%' }}
              />
              {errors.lastName1 && <small className="p-error">{errors.lastName1}</small>}

              {/* SEGUNDO APELLIDO */}
              <InputText
                id="lastName2"
                value={formData.lastName2}
                onChange={(e) => handleInputChange('lastName2', e.target.value)}
                placeholder="Segundo apellido"
                disabled={loading}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          {/* EMAIL */}
          <div className="form-field">
            <label htmlFor="email">Correo Electrónico *</label>
            <InputText
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={errors.email ? 'p-invalid' : ''}
              placeholder="nombre.apellido@correo.com"
              disabled={loading}
            />
            {errors.email && <small className="p-error">{errors.email}</small>}
          </div>

          {/* USERNAME */}
          <div className="form-field">
            <label htmlFor="username">Usuario *</label>
            <small>(Nombre visible en juegos)</small>
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

          {/* FECHA DE NACIMIENTO */}
          <div className="form-field">
            <label htmlFor="birthDate">Fecha de Nacimiento *</label>
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

          {/* SECCIÓN Y GRUPO */}
          <div className="form-field">
            <label>Sección y Grupo *</label>
            <div className="seccion-grupo-container">
              {/* SECCIÓN */}
              <Dropdown
                id="seccion"
                value={formData.seccion}
                options={seccionOptions}
                onChange={(e) => handleInputChange('seccion', e.value)}
                placeholder="Sección"
                className={errors.seccion ? 'p-invalid' : ''}
                disabled={loading}
              />
              {errors.seccion && <small className="p-error">{errors.seccion}</small>}

              {/* GRUPO */}
              <Dropdown
                id="grupo"
                value={formData.grupo}
                options={grupoOptions}
                onChange={(e) => handleInputChange('grupo', e.value)}
                placeholder="Grupo"
                className={errors.grupo ? 'p-invalid' : ''}
                disabled={loading || !formData.seccion}
              />
              {errors.grupo && <small className="p-error">{errors.grupo}</small>}
            </div>
          </div>

          {/* CONSENTIMIENTO */}
          <div className="consent-field">
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
            <label htmlFor="consent">
              Acepto el tratamiento de mis datos personales conforme a la{' '}
              <a href="/privacy" target="_blank">
                política de privacidad
              </a>
            </label>
          </div>
          {errors.consent && <small className="p-error">{errors.consent}</small>}

          {/* BOTÓN SUBMIT */}
          <Button
            type="submit"
            label={loading ? 'Registrando...' : 'Registrarme'}
            icon={loading ? 'pi pi-spin pi-spinner' : 'pi pi-user-plus'}
            className="submit-button"
            disabled={!isFormComplete || loading}
          />

          {/* AVISO DE PRIVACIDAD */}
          <div className="privacy-notice">
            <i className="pi pi-info-circle"></i>
            <small>
              Protección de datos: Tus datos serán utilizados únicamente para gestionar tu
              participación en las actividades del centro juvenil. Puedes solicitar la eliminación
              de tus datos en cualquier momento.
            </small>
          </div>
        </form>
      </Card>
    </div>
  );
};
