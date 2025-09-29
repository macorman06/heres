import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Chips } from 'primereact/chips';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import { Badge } from 'primereact/badge';
import { User } from '../../services/api';

interface UserFormData {
  nombre: string;
  apellido1: string;
  apellido2?: string;
  email?: string;
  password?: string;
  rol_id: number;
  centro_juvenil?: string;
  seccion?: string;
  sexo?: 'M' | 'F';
  birthday?: string;
  direccion?: string;
  localidad?: string;
  telefono?: string;
  alergias?: string[];
  talla?: 'XS' | 'S' | 'M' | 'L' | 'XL';
}

interface UserFormDialogProps {
  visible: boolean;
  user?: User | null;
  isEditMode: boolean;
  isViewMode?: boolean;
  formData: UserFormData;
  onHide: () => void;
  onSave?: () => void;
  onFormChange?: (field: keyof UserFormData, value: any) => void;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
                                                                visible,
                                                                user,
                                                                isEditMode,
                                                                isViewMode = false,
                                                                formData,
                                                                onHide,
                                                                onSave,
                                                                onFormChange
                                                              }) => {
  // Options for dropdowns
  const roleOptions = [
    { label: 'Superusuario', value: 1 },
    { label: 'Director', value: 2 },
    { label: 'Coordinador', value: 3 },
    { label: 'Animador', value: 4 },
    { label: 'Miembro', value: 5 }
  ];

  const sexOptions = [
    { label: 'Masculino', value: 'M' },
    { label: 'Femenino', value: 'F' }
  ];

  const sizeOptions = [
    { label: 'XS', value: 'XS' },
    { label: 'S', value: 'S' },
    { label: 'M', value: 'M' },
    { label: 'L', value: 'L' },
    { label: 'XL', value: 'XL' }
  ];

  const sectionOptions = [
    { label: 'Chiqui', value: 'Chiqui' },
    { label: 'Centro Juvenil', value: 'Centro Juvenil' }
  ];

  // ✅ NEW: Centro Juvenil options
  const centroJuvenilOptions = [
    { label: 'Juveliber', value: 'Juveliber' },
    { label: 'La Balsa', value: 'La Balsa' },
    { label: 'Sotojoven', value: 'Sotojoven' },
    { label: 'Otro', value: 'Otro' }
  ];

  const getDialogTitle = () => {
    if (isViewMode) return 'Información del Usuario';
    return isEditMode ? 'Editar Usuario' : 'Crear Usuario';
  };

  const getRoleLabel = (roleId: number) => {
    const role = roleOptions.find(r => r.value === roleId);
    return role ? role.label : 'Desconocido';
  };

  const getSexLabel = (sex: string) => {
    const sexOption = sexOptions.find(s => s.value === sex);
    return sexOption ? sexOption.label : 'No especificado';
  };

  const getSizeLabel = (size: string) => {
    const sizeOption = sizeOptions.find(s => s.value === size);
    return sizeOption ? sizeOption.label : 'No especificada';
  };

  const getCentroJuvenilLabel = (centro: string) => {
    const centroOption = centroJuvenilOptions.find(c => c.value === centro);
    return centroOption ? centroOption.label : centro || 'No especificado';
  };

  const calculateAge = (birthday: string) => {
    if (!birthday) return null;
    const today = new Date();
    const birthDate = new Date(birthday);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // ✅ Common styling for consistent height
  const inputClassName = "w-full h-[2.75rem]"; // 44px height
  const dropdownClassName = "w-full h-[2.75rem]";
  const calendarClassName = "w-full [&>.p-calendar>.p-inputtext]:h-[2.75rem]";
  const multiSelectClassName = "w-full [&>.p-multiselect-label-container]:min-h-[2.75rem]";
  const chipsClassName = "w-full [&>.p-chips-multiple-container]:min-h-[2.75rem]";

  return (
    <Dialog
      header={getDialogTitle()}
      visible={visible}
      style={{ width: '700px', maxWidth: '90vw' }}
      modal
      className="p-fluid"
      onHide={onHide}
      maskStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(2px)'
      }}
      contentStyle={{
        maxHeight: '80vh',
        overflowY: 'auto'
      }}
      footer={
        !isViewMode && (
          <div className="flex justify-center w-full">
            <Button
              label="Guardar"
              icon="pi pi-check"
              onClick={onSave}
              className="px-8 py-2 bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700"
            />
          </div>
        )
      }
    >
      <div className="space-y-6">

        {/* SECCIÓN 1: Información Personal Básica */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <i className="pi pi-user mr-2 text-red-600"></i>
            Información Personal
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Nombre *
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {formData.nombre || user?.nombre}
                </div>
              ) : (
                <InputText
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => onFormChange?.('nombre', e.target.value)}
                  required
                  className={inputClassName}
                  placeholder="Introduce el nombre"
                />
              )}
            </div>

            <div>
              <label htmlFor="apellido1" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Primer Apellido *
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {formData.apellido1 || user?.apellido1}
                </div>
              ) : (
                <InputText
                  id="apellido1"
                  value={formData.apellido1}
                  onChange={(e) => onFormChange?.('apellido1', e.target.value)}
                  required
                  className={inputClassName}
                  placeholder="Introduce el primer apellido"
                />
              )}
            </div>

            <div>
              <label htmlFor="apellido2" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Segundo Apellido
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {formData.apellido2 || user?.apellido2 || 'No especificado'}
                </div>
              ) : (
                <InputText
                  id="apellido2"
                  value={formData.apellido2}
                  onChange={(e) => onFormChange?.('apellido2', e.target.value)}
                  className={inputClassName}
                  placeholder="Introduce el segundo apellido"
                />
              )}
            </div>

            <div>
              <label htmlFor="sexo" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Sexo
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {getSexLabel(formData.sexo || user?.sexo || '')}
                </div>
              ) : (
                <Dropdown
                  id="sexo"
                  value={formData.sexo}
                  options={sexOptions}
                  onChange={(e) => onFormChange?.('sexo', e.value)}
                  className={dropdownClassName}
                  placeholder="Seleccionar sexo"
                />
              )}
            </div>

            <div>
              <label htmlFor="birthday" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Fecha de Nacimiento
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {formData.birthday || user?.birthday
                    ? new Date(formData.birthday || user.birthday!).toLocaleDateString('es-ES')
                    : 'No especificada'
                  }
                  {(formData.birthday || user?.birthday) && (
                    <Badge
                      value={`${calculateAge(formData.birthday || user.birthday!)} años`}
                      severity="info"
                      className="ml-2"
                    />
                  )}
                </div>
              ) : (
                <Calendar
                  id="birthday"
                  value={formData.birthday ? new Date(formData.birthday) : null}
                  onChange={(e) => {
                    const date = e.value as Date;
                    onFormChange?.('birthday', date ? date.toISOString().split('T')[0] : '');
                  }}
                  showIcon
                  className={calendarClassName}
                  placeholder="Seleccionar fecha"
                  dateFormat="dd/mm/yy"
                  maxDate={new Date()}
                  yearNavigator
                  yearRange="1900:2024"
                />
              )}
            </div>

            <div>
              <label htmlFor="talla" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Talla
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {getSizeLabel(formData.talla || user?.talla || '')}
                </div>
              ) : (
                <Dropdown
                  id="talla"
                  value={formData.talla}
                  options={sizeOptions}
                  onChange={(e) => onFormChange?.('talla', e.value)}
                  className={dropdownClassName}
                  placeholder="Seleccionar talla"
                />
              )}
            </div>
          </div>
        </div>

        <Divider />

        {/* SECCIÓN 2: Información de Contacto */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <i className="pi pi-phone mr-2 text-blue-600"></i>
            Información de Contacto
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Email {!isViewMode && '(solo para acceso al sistema)'}
                {isViewMode && user?.can_login && (
                  <Badge value="Puede acceder" severity="success" className="ml-2" />
                )}
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {formData.email || user?.email || 'Sin email'}
                </div>
              ) : (
                <InputText
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => onFormChange?.('email', e.target.value)}
                  className={inputClassName}
                  placeholder="usuario@email.com"
                />
              )}
            </div>

            {!isViewMode && formData.email && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  {isEditMode ? 'Nueva Contraseña (dejar vacío para mantener)' : 'Contraseña'}
                </label>
                <InputText
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => onFormChange?.('password', e.target.value)}
                  className={inputClassName}
                  placeholder="Introducir contraseña"
                />
              </div>
            )}

            <div>
              <label htmlFor="telefono" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Teléfono
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {formData.telefono || user?.telefono || 'No especificado'}
                </div>
              ) : (
                <InputText
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => onFormChange?.('telefono', e.target.value)}
                  className={inputClassName}
                  placeholder="123 456 789"
                />
              )}
            </div>

            <div>
              <label htmlFor="direccion" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Dirección
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {formData.direccion || user?.direccion || 'No especificada'}
                </div>
              ) : (
                <InputText
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => onFormChange?.('direccion', e.target.value)}
                  className={inputClassName}
                  placeholder="Calle, número, etc."
                />
              )}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="localidad" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Localidad
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {formData.localidad || user?.localidad || 'No especificada'}
                </div>
              ) : (
                <InputText
                  id="localidad"
                  value={formData.localidad}
                  onChange={(e) => onFormChange?.('localidad', e.target.value)}
                  className={inputClassName}
                  placeholder="Ciudad, pueblo, etc."
                />
              )}
            </div>
          </div>
        </div>

        <Divider />

        {/* SECCIÓN 3: Información del Centro */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <i className="pi pi-building mr-2 text-green-600"></i>
            Centro y Rol
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="centro_juvenil" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Centro Juvenil
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {getCentroJuvenilLabel(formData.centro_juvenil || user?.centro_juvenil || '')}
                </div>
              ) : (
                <Dropdown
                  id="centro_juvenil"
                  value={formData.centro_juvenil}
                  options={centroJuvenilOptions}
                  onChange={(e) => onFormChange?.('centro_juvenil', e.value)}
                  className={dropdownClassName}
                  placeholder="Seleccionar centro juvenil"
                />
              )}
            </div>

            <div>
              <label htmlFor="rol_id" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Rol en el Centro
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  <Badge
                    value={getRoleLabel(formData.rol_id || user?.rol_id || 5)}
                    severity={
                      (formData.rol_id || user?.rol_id || 5) <= 2 ? 'danger' :
                        (formData.rol_id || user?.rol_id || 5) === 3 ? 'warning' :
                          (formData.rol_id || user?.rol_id || 5) === 4 ? 'success' : 'info'
                    }
                  />
                </div>
              ) : (
                <Dropdown
                  id="rol_id"
                  value={formData.rol_id}
                  options={roleOptions}
                  onChange={(e) => onFormChange?.('rol_id', e.value)}
                  className={dropdownClassName}
                  placeholder="Seleccionar rol"
                />
              )}
            </div>

            {/* Secciones - ✅ FIXED: Cambiar de MultiSelect a Dropdown */}
            <div className="md:col-span-2">
              <label htmlFor="seccion" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Sección
              </label>
              {isViewMode ? (
                <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                  {formData.seccion || user?.seccion ? (
                    <Badge value={formData.seccion || user?.seccion} severity="secondary" />
                  ) : (
                    'Sin sección asignada'
                  )}
                </div>
              ) : (
                <Dropdown
                  id="seccion"
                  value={formData.seccion}
                  options={sectionOptions}
                  onChange={(e) => onFormChange?.('seccion', e.value)}
                  placeholder="Seleccionar sección"
                  className={dropdownClassName}
                />
              )}
            </div>
          </div>
        </div>

        <Divider />

        {/* SECCIÓN 4: Información Adicional */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
            <i className="pi pi-info-circle mr-2 text-orange-600"></i>
            Información Adicional
          </h3>

          <div>
            <label htmlFor="alergias" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
              Alergias e Intolerancias
            </label>
            {isViewMode ? (
              <div className={`${inputClassName} p-3 bg-gray-50 dark:bg-gray-700 rounded border text-gray-900 dark:text-gray-100 flex items-center`}>
                {(formData.alergias || user?.alergias)?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {(formData.alergias || user?.alergias)?.map((alergia, index) => (
                      <Badge key={index} value={alergia} severity="warning" />
                    ))}
                  </div>
                ) : (
                  'Sin alergias registradas'
                )}
              </div>
            ) : (
              <>
                <Chips
                  id="alergias"
                  value={formData.alergias}
                  onChange={(e) => onFormChange?.('alergias', e.value || [])}
                  placeholder="Agregar alergia y presionar Enter"
                  className={chipsClassName}
                  separator=","
                />
                <small className="text-gray-500 dark:text-gray-400 mt-1 block">
                  Escribe el nombre de la alergia y presiona Enter para añadirla
                </small>
              </>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
