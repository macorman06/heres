import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { User, CreateUserRequest, ROLES } from '../../services/api';

interface UserDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (userData: CreateUserRequest) => Promise<void>;
  user?: User | null;
  loading?: boolean;
}

const ROLE_OPTIONS = [
  { label: 'Superusuario', value: ROLES.SUPERUSER },
  { label: 'Director', value: ROLES.DIRECTOR },
  { label: 'Coordinador', value: ROLES.COORDINADOR },
  { label: 'Animador', value: ROLES.ANIMADOR },
  { label: 'Miembro', value: ROLES.MIEMBRO },
];

const SECTION_OPTIONS = [
  { label: 'J1', value: 'J1' },
  { label: 'J2', value: 'J2' },
  { label: 'J3', value: 'J3' },
  { label: 'Chiqui', value: 'Chiqui' },
  { label: 'CJ', value: 'CJ' },
];

const GENDER_OPTIONS = [
  { label: 'Masculino', value: 'M' },
  { label: 'Femenino', value: 'F' },
];

const SIZE_OPTIONS = [
  { label: 'XS', value: 'XS' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' },
];

export const UserDialog: React.FC<UserDialogProps> = ({
  visible,
  onHide,
  onSave,
  user,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    nombre: '',
    apellido1: '',
    apellido2: '',
    email: '',
    password: '',
    rol_id: ROLES.MIEMBRO,
    seccion: [],
    sexo: 'M',
    edad: 18,
    direccion: '',
    localidad: '',
    alergias: [],
    talla: 'M',
    telefono: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allergiesInput, setAllergiesInput] = useState('');

  const isEditMode = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido1: user.apellido1 || '',
        apellido2: user.apellido2 || '',
        email: user.email || '',
        password: '', // Don't populate password for editing
        rol_id: user.rol_id || ROLES.MIEMBRO,
        seccion: user.seccion || [],
        sexo: user.sexo || 'M',
        edad: user.edad || 18,
        direccion: user.direccion || '',
        localidad: user.localidad || '',
        alergias: user.alergias || [],
        talla: user.talla || 'M',
        telefono: user.telefono || '',
      });
      setAllergiesInput((user.alergias || []).join(', '));
    } else {
      // Reset form for new user
      setFormData({
        nombre: '',
        apellido1: '',
        apellido2: '',
        email: '',
        password: '',
        rol_id: ROLES.MIEMBRO,
        seccion: [],
        sexo: 'M',
        edad: 18,
        direccion: '',
        localidad: '',
        alergias: [],
        talla: 'M',
        telefono: '',
      });
      setAllergiesInput('');
    }
    setErrors({});
  }, [user, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido1.trim()) {
      newErrors.apellido1 = 'El primer apellido es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!isEditMode && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!isEditMode && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.edad || formData.edad < 1 || formData.edad > 120) {
      newErrors.edad = 'La edad debe estar entre 1 y 120 años';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      // Process allergies
      const allergies = allergiesInput
        .split(',')
        .map((allergy) => allergy.trim())
        .filter((allergy) => allergy.length > 0);

      const userData = {
        ...formData,
        alergias: allergies,
      };

      // Remove password if editing and it's empty
      if (isEditMode && !userData.password) {
        delete (userData as unknown).password;
      }

      await onSave(userData);
      onHide();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleInputChange = (field: keyof CreateUserRequest, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const dialogHeader = (
    <div className="flex items-center space-x-3">
      <i className={`pi ${isEditMode ? 'pi-user-edit' : 'pi-user-plus'} text-red-600`} />
      <span>{isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</span>
    </div>
  );

  return (
    <Dialog
      header={dialogHeader}
      visible={visible}
      onHide={onHide}
      style={{ width: '90vw', maxWidth: '800px' }}
      modal
      className="p-fluid"
      footer={
        <div className="flex justify-end space-x-3">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            outlined
            onClick={onHide}
            disabled={loading}
          />
          <Button
            label={isEditMode ? 'Actualizar' : 'Crear'}
            icon={isEditMode ? 'pi pi-check' : 'pi pi-plus'}
            className="bg-red-600 border-red-600"
            onClick={handleSubmit}
            loading={loading}
          />
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Información Personal
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nombre *
            </label>
            <InputText
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Nombre"
              className={errors.nombre ? 'p-invalid' : ''}
            />
            {errors.nombre && <small className="p-error">{errors.nombre}</small>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primer Apellido *
            </label>
            <InputText
              value={formData.apellido1}
              onChange={(e) => handleInputChange('apellido1', e.target.value)}
              placeholder="Primer apellido"
              className={errors.apellido1 ? 'p-invalid' : ''}
            />
            {errors.apellido1 && <small className="p-error">{errors.apellido1}</small>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Segundo Apellido
            </label>
            <InputText
              value={formData.apellido2}
              onChange={(e) => handleInputChange('apellido2', e.target.value)}
              placeholder="Segundo apellido (opcional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email *
            </label>
            <InputText
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="email@ejemplo.com"
              className={errors.email ? 'p-invalid' : ''}
            />
            {errors.email && <small className="p-error">{errors.email}</small>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {isEditMode ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
            </label>
            <Password
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder={isEditMode ? 'Nueva contraseña' : 'Contraseña'}
              feedback={!isEditMode}
              toggleMask
              className={errors.password ? 'p-invalid' : ''}
            />
            {errors.password && <small className="p-error">{errors.password}</small>}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Información Adicional
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rol *
            </label>
            <Dropdown
              value={formData.rol_id}
              options={ROLE_OPTIONS}
              onChange={(e) => handleInputChange('rol_id', e.value)}
              placeholder="Seleccionar rol"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Secciones
            </label>
            <MultiSelect
              value={formData.seccion}
              options={SECTION_OPTIONS}
              onChange={(e) => handleInputChange('seccion', e.value)}
              placeholder="Seleccionar secciones"
              display="chip"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sexo
              </label>
              <Dropdown
                value={formData.sexo}
                options={GENDER_OPTIONS}
                onChange={(e) => handleInputChange('sexo', e.value)}
                placeholder="Seleccionar"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Edad *
              </label>
              <InputNumber
                value={formData.edad}
                onValueChange={(e) => handleInputChange('edad', e.value)}
                min={1}
                max={120}
                placeholder="Edad"
                className={errors.edad ? 'p-invalid' : ''}
              />
              {errors.edad && <small className="p-error">{errors.edad}</small>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dirección
            </label>
            <InputText
              value={formData.direccion}
              onChange={(e) => handleInputChange('direccion', e.target.value)}
              placeholder="Dirección completa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Localidad
            </label>
            <InputText
              value={formData.localidad}
              onChange={(e) => handleInputChange('localidad', e.target.value)}
              placeholder="Ciudad/Localidad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teléfono
            </label>
            <InputText
              value={formData.telefono}
              onChange={(e) => handleInputChange('telefono', e.target.value)}
              placeholder="Número de teléfono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Talla
            </label>
            <Dropdown
              value={formData.talla}
              options={SIZE_OPTIONS}
              onChange={(e) => handleInputChange('talla', e.value)}
              placeholder="Seleccionar talla"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alergias
            </label>
            <InputText
              value={allergiesInput}
              onChange={(e) => setAllergiesInput(e.target.value)}
              placeholder="Separar con comas (ej: polen, frutos secos)"
            />
            <small className="text-gray-500 dark:text-gray-400">
              Separar múltiples alergias con comas
            </small>
          </div>
        </div>
      </div>

      {Object.keys(errors).length > 0 && (
        <Message
          severity="error"
          text="Por favor, corrige los errores antes de continuar"
          className="mt-4"
        />
      )}
    </Dialog>
  );
};
