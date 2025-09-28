import { DailyInfo } from './Efemerides';

export const catholicSaints: Record<string, DailyInfo> = {
  '1-1': {
    title: 'Santa María Madre de Dios',
    description: 'Solemnidad de María como Madre de Dios y también Día Mundial de la Paz.',
    icon: 'pi pi-star-fill'
  },
  '1-21': {
    title: 'Santa Inés',
    description: 'Virgen y mártir romana del siglo IV, símbolo de pureza y fortaleza en la fe.',
    icon: 'pi pi-heart'
  },
  '3-19': {
    title: 'San José',
    description: 'Esposo de María y padre adoptivo de Jesús, patrono de los trabajadores y de la Iglesia universal.',
    icon: 'pi pi-home'
  },
  '4-23': {
    title: 'San Jorge',
    description: 'Mártir del siglo IV, soldado romano que dio testimonio de su fe cristiana.',
    icon: 'pi pi-shield'
  },
  '6-24': {
    title: 'San Juan Bautista',
    description: 'Precursor de Cristo, el último de los profetas del Antiguo Testamento.',
    icon: 'pi pi-eye'
  },
  '7-25': {
    title: 'Santiago Apóstol',
    description: 'Uno de los doce apóstoles, patrono de España, llamado "el Mayor".',
    icon: 'pi pi-map'
  },
  '8-15': {
    title: 'Asunción de María',
    description: 'Solemnidad que celebra la elevación de María en cuerpo y alma al cielo.',
    icon: 'pi pi-star-fill'
  },
  '9-21': {
    title: 'San Mateo Apóstol',
    description: 'Evangelista y apóstol, recaudador de impuestos que siguió a Jesús y escribió el primer Evangelio.',
    icon: 'pi pi-book'
  },
  '9-26': {
    title: 'San Cosme y San Damián',
    description: 'Hermanos gemelos médicos y mártires del siglo III. Patronos de médicos y farmacéuticos, curaban gratuitamente a los enfermos.',
    icon: 'pi pi-plus'
  },
  '9-27': {
    title: 'San Vicente de Paúl',
    description: 'Sacerdote francés, apóstol de la caridad. Fundador de congregaciones dedicadas al servicio de los pobres.',
    icon: 'pi pi-heart'
  },
  '9-29': {
    title: 'Santos Arcángeles',
    description: 'Miguel, Gabriel y Rafael. Los tres arcángeles mencionados por nombre en las Escrituras.',
    icon: 'pi pi-star-fill'
  },
  '9-30': {
    title: 'San Jerónimo',
    description: 'Doctor de la Iglesia, traductor de la Biblia al latín (Vulgata). Ermitaño y gran estudioso de las Escrituras.',
    icon: 'pi pi-file-edit'
  },
  '10-4': {
    title: 'San Francisco de Asís',
    description: 'Fundador de los franciscanos, santo de la pobreza y el amor a la naturaleza.',
    icon: 'pi pi-sun'
  },
  '11-1': {
    title: 'Todos los Santos',
    description: 'Solemnidad que honra a todos los santos, conocidos y desconocidos.',
    icon: 'pi pi-star-fill'
  },
  '12-25': {
    title: 'Natividad del Señor',
    description: 'Celebración del nacimiento de Jesucristo, Salvador del mundo.',
    icon: 'pi pi-star'
  }
};

export const getDefaultCatholicInfo = (): DailyInfo => ({
  title: 'Santo del Día',
  description: 'Cada día la Iglesia celebra la memoria de santos y beatos que nos inspiran en el camino de la santidad.',
  icon: 'pi pi-sun'
});
