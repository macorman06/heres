import React, { useState, useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Member, CreateMemberRequest } from '../../services/api';

interface MemberDialogProps {
  visible: boolean;
  onHide: () => void;
  onSave: (memberData: CreateMemberRequest) => Promise<void>;
  member?: Member | null;
  loading?: boolean;
}

const SECTION_OPTIONS = [
  { label: 'J1', value: 'J1' },
  { label: 'J2', value: 'J2' },
  { label: 'J3', value: 'J3' },
  { label: 'Chiqui', value: 'Chiqui' },
  { label: 'CJ', value: 'CJ' }
];

const GENDER_OPTIONS = [
  { label: 'Masculino', value: 'M' },
  { label: 'Femenino', value: 'F' }
];

const SIZE_OPTIONS = [
  { label: 'XS', value: 'XS' },
  { label: 'S', value: 'S' },
  { label: 'M', value: 'M' },
  { label: 'L', value: 'L' },
  { label: 'XL', value: 'XL' }
];

export const MemberDialog: React.FC<MemberDialogProps> = ({
  visible,
  onHide,
  onSave,
  member,
  loading = false
}) => {
  const [formData, setFormData] = useState<CreateMemberRequest>({
    nombre: '',
    apellido1: '',
    apellido2: '',
    centro_juvenil: 'Centro Juvenil Salesianos',
    seccion: 'CJ',
    edad: 12,
    sexo: 'M',
    direccion: '',
    localidad: '',
    telefono: '',
    email_contacto: '',
    alergias: [],
    talla: 'M'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [allergiesInput, setAllergiesInput] = useState('');

  const isEditMode = !!member;

  useEffect(() => {
    if (member) {
      setFormData({
        nombre: member.nombre || '',
        apellido1: member.apellido1 || '',
        apellido2: member.apellido2 || '',
        centro_juvenil: member.centro_juvenil || 'Centro Juvenil Salesianos',
        seccion: member.seccion || 'CJ',
        edad: member.edad || 12,
        sexo: member.sexo || 'M',
        direccion: member.direccion || '',
        localidad: member.localidad || '',
        telefono: member.telefono || '',
        email_contacto: member.email_contacto || '',
        alergias: member.alergias || [],
        talla: member.talla || 'M'
      });
      setAllergiesInput((member.alergias || []).join(', '));
    } else {
      // Reset form for new member
      setFormData({
        nombre: '',
        apellido1: '',
        apellido2: '',
        centro_juvenil: 'Centro Juvenil Salesianos',
        seccion: 'CJ',
        edad: 12,
        sexo: 'M',
        direccion: '',
        localidad: '',
        telefono: '',
        email_contacto: '',
        alergias: [],
        talla: 'M'
      });
      setAllergiesInput('');
    }
    setErrors({});
  }, [member, visible]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.apellido1.trim()) {
      newErrors.apellido1 = 'El primer apellido es requerido';
    }

    if (!formData.centro_juvenil.trim()) {
      newErrors.centro_juvenil = 'El centro juvenil es requerido';
    }

    if (!formData.seccion.trim()) {
      newErrors.seccion = 'La sección es requerida';
    }

    if (!formData.edad || formData.edad < 1 || formData.edad > 120) {
      newErrors.edad = 'La edad debe estar entre 1 y 120 años';
    }

    if (formData.email_contacto && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email_contacto)) {
      newErrors.email_contacto = 'El email no es válido';
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
        .map(allergy => allergy.trim())
        .filter(allergy => allergy.length > 0);

      const memberData = {
        ...formData,
        alergias: allergies
      };

      await onSave(memberData);
      onHide();
    } catch (error) {
      console.error('Error saving member:', error);
    }
  };

  const handleInputChange = (field: keyof CreateMemberRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const dialogHeader = (
    <div className="flex items-center space-x-3">
      <i className={`pi ${isEditMode ? 'pi-users' : 'pi-user-plus'} text-green-600`} />
      <span>{isEditMode ? 'Editar Miembro' : 'Crear Nuevo Miembro'}</span>
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
            className="bg-green-600 border-green-600"
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
              Centro Juvenil *
            </label>
            <InputText
              value={formData.centro_juvenil}
              onChange={(e) => handleInputChange('centro_juvenil', e.target.value)}
              placeholder="Centro Juvenil"
              className={errors.centro_juvenil ? 'p-invalid' : ''}
            />
            {errors.centro_juvenil && <small className="p-error">{errors.centro_juvenil}</small>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Sección *
            </label>
            <Dropdown
              value={formData.seccion}
              options={SECTION_OPTIONS}
              onChange={(e) => handleInputChange('seccion', e.value)}
              placeholder="Seleccionar sección"
              className={errors.seccion ? 'p-invalid' : ''}
            />
            {errors.seccion && <small className="p-error">{errors.seccion}</small>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sexo *
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
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Información de Contacto
          </h3>

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
              Email de Contacto
            </label>
            <InputText
              type="email"
              value={formData.email_contacto}
              onChange={(e) => handleInputChange('email_contacto', e.target.value)}
              placeholder="email@ejemplo.com (opcional)"
              className={errors.email_contacto ? 'p-invalid' : ''}
            />
            {errors.email_contacto && <small className="p-error">{errors.email_contacto}</small>}
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