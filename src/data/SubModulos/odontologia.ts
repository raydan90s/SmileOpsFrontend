import { User, Calendar } from 'lucide-react-native';
import { MenuItem } from '@models/MenuItem/MenuItem.types';

export const menuItems: MenuItem[] = [
  {
    id: 'datos-personales',
    title: 'Datos Personales',
    subtitle: 'Gestión de información personal de pacientes',
    icon: User,
    route: '/odontologia/datos-personales',
  },
  {
    id: 'citas-medicas',
    title: 'Citas Médicas',
    subtitle: 'Programación y gestión de citas',
    icon: Calendar,
    route: '/odontologia/citas-medicas',
  },
];

export const findMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find((item) => item.id === id);
};