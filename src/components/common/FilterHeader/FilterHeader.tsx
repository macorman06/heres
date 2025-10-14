// src/components/common/FilterHeader/FilterHeader.tsx

import React from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import './FilterHeader.css';

export type FilterFieldType = 'search' | 'dropdown' | 'multiselect' | 'selectButton' | 'custom';

export interface FilterField {
  id: string;
  type: FilterFieldType;
  label?: string;
  placeholder?: string;
  value: any;
  options?: Array<{ label: string; value: any }>;
  onChange: (value: any) => void;
  showClear?: boolean;
  className?: string;
  icon?: string;
  maxSelectedLabels?: number; // Para MultiSelect
  selectedItemsLabel?: string; // Para MultiSelect (ej: "{0} roles seleccionados")
  display?: 'comma' | 'chip'; // Para MultiSelect - cómo mostrar los seleccionados
}

interface FilterHeaderProps {
  fields: FilterField[];
  onClearAll?: () => void;
  resultsCount?: number;
  resultsLabel?: string;
  showViewToggle?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export const FilterHeader: React.FC<FilterHeaderProps> = ({
  fields,
  onClearAll,
  resultsCount,
  resultsLabel = 'resultados',
  showViewToggle = false,
  viewMode = 'grid',
  onViewModeChange,
}) => {
  const renderField = (field: FilterField) => {
    switch (field.type) {
      case 'search':
        return (
          <div key={field.id} className="filter-field filter-search">
            <span className="p-input-icon-left">
              <i className={field.icon || 'pi pi-search'} />
              <InputText
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                placeholder={field.placeholder || 'Buscar...'}
                className="search-input"
              />
            </span>
          </div>
        );

      case 'dropdown':
        return (
          <Dropdown
            key={field.id}
            value={field.value}
            options={field.options || []}
            onChange={(e) => field.onChange(e.value)}
            placeholder={field.placeholder || field.label}
            className={`filter-dropdown-inline ${field.className || ''}`}
            showClear={field.showClear}
          />
        );

      case 'multiselect':
        return (
          <MultiSelect
            key={field.id}
            value={field.value}
            options={field.options || []}
            onChange={(e) => field.onChange(e.value)}
            placeholder={field.placeholder || field.label}
            className={`filter-multiselect-inline ${field.className || ''}`}
            maxSelectedLabels={field.maxSelectedLabels}
            selectedItemsLabel={field.selectedItemsLabel}
            display={field.display || 'chip'}
          />
        );

      case 'selectButton':
        return (
          <SelectButton
            key={field.id}
            value={field.value}
            options={field.options || []}
            onChange={(e) => field.onChange(e.value)}
            className={`filter-select-bordered ${field.className || ''}`}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="filter-header-container">
      {fields.map(renderField)}

      {onClearAll && (
        <Button
          icon="pi pi-filter-slash"
          onClick={onClearAll}
          className="p-button-outlined p-button-secondary btn-clear-filters"
          tooltip="Limpiar filtros"
          tooltipOptions={{ position: 'bottom' }}
        />
      )}

      {showViewToggle && onViewModeChange && (
        <Button
          icon={viewMode === 'grid' ? 'pi pi-list' : 'pi pi-th-large'}
          onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
          className="p-button-outlined p-button-secondary btn-view-mode"
          tooltip={viewMode === 'grid' ? 'Vista de lista' : 'Vista de cards'}
          tooltipOptions={{ position: 'bottom' }}
        />
      )}

      {resultsCount !== undefined && (
        <div className="results-count-inline">
          {resultsCount} {resultsLabel}
        </div>
      )}
    </div>
  );
};
