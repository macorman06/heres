export interface DailyInfo {
  title: string;
  description: string;
  icon: string;
}

export const salesianEphemerides: Record<string, DailyInfo> = {
  '1-31': {
    title: 'San Juan Bosco',
    description: 'Fundador de los Salesianos, Padre y Maestro de la Juventud. Su carisma sigue vivo hoy.',
    icon: 'pi pi-star'
  },
  '5-6': {
    title: 'Santo Domingo Savio',
    description: 'Joven santo salesiano, modelo de santidad juvenil y alegría cristiana.',
    icon: 'pi pi-sun'
  },
  '5-24': {
    title: 'María Auxiliadora',
    description: 'Patrona de los Salesianos, Madre y Maestra que acompaña nuestra misión educativa.',
    icon: 'pi pi-star-fill'
  },
  '8-16': {
    title: 'San Juan Bosco - Primera Misa',
    description: 'Aniversario de la primera misa de Don Bosco, momento clave en su vocación salesiana.',
    icon: 'pi pi-book'
  },
  '9-21': {
    title: 'Día Internacional de la Paz',
    description: 'En el espíritu de Don Bosco, trabajamos por la paz entre los jóvenes del mundo entero.',
    icon: 'pi pi-globe'
  },
  '9-22': {
    title: 'Beatos Mártires Salesianos',
    description: 'Memoria del Beato José Calasanz Marqués y 93 compañeros mártires, testigos de fe en tiempos difíciles.',
    icon: 'pi pi-heart'
  },
  '9-24': {
    title: 'San Francisco de Sales',
    description: 'Patrono de la Congregación Salesiana, obispo y doctor de la Iglesia, modelo de dulzura y caridad.',
    icon: 'pi pi-star'
  },
  '9-26': {
    title: 'Mes de la Educación',
    description: 'Septiembre nos recuerda el compromiso salesiano con la educación integral de los jóvenes.',
    icon: 'pi pi-book'
  },
  '10-3': {
    title: 'Beata Alexandrina María da Costa',
    description: 'Cooperadora salesiana, ejemplo de fe y sufrimiento ofrecido por la salvación de las almas.',
    icon: 'pi pi-heart'
  },
  '11-13': {
    title: 'Beato Artemides Zatti',
    description: 'Hermano salesiano, enfermero de los pobres en Argentina, beatificado en 2002.',
    icon: 'pi pi-plus'
  },
  '12-8': {
    title: 'Inmaculada Concepción',
    description: 'Fiesta especial para los salesianos, María Inmaculada inspira nuestra misión educativa.',
    icon: 'pi pi-star-fill'
  }
};

export const getDefaultSalesianInfo = (): DailyInfo => ({
  title: 'Espíritu Salesiano',
  description: 'Cada día es una oportunidad para vivir la alegría, la bondad y el amor por los jóvenes que nos enseñó Don Bosco.',
  icon: 'pi pi-heart'
});
