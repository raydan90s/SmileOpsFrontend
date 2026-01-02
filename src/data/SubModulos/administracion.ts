import { 
  Package, 
  ClipboardList,
  Settings, 
  Users
} from 'lucide-react-native';
import { MenuItem } from '@models/MenuItem/MenuItem.types';

export const menuItems: MenuItem[] = [
  {
    id: 'proveedores',
    title: 'Proveedores',
    subtitle: 'Gestionar proveedores del sistema',
    icon: Package,
    route: '/administracion/proveedores',
  },
  {
    id: 'estado-pedidos',
    title: 'Estado de Pedidos',
    subtitle: 'Seguimiento de pedidos realizados',
    icon: ClipboardList,
    route: '/administracion/estado-pedidos',
  },
  {
    id: 'parametros-generales',
    title: 'Parámetros Generales',
    subtitle: 'Configuración general del sistema',
    icon: Settings,
    route: '/administracion/parametros-generales',
    children: [
      {
        id: 'productos',
        title: 'Nombre de productos',
        subtitle: 'Gestión de productos',
        icon: Package,
        route: '/administracion/parametros-generales/productoNombre',
      },
      {
        id: 'caracteristicas',
        title: 'Características',
        subtitle: 'Características de productos',
        icon: Settings,
        route: '/administracion/parametros-generales/caracteristicas',
      },
      {
        id: 'marcas',
        title: 'Marcas',
        subtitle: 'Gestión de marcas',
        icon: Package,
        route: '/administracion/parametros-generales/marcas',
      },
      {
        id: 'definicion-producto',
        title: 'Definición del Producto',
        subtitle: 'Configuración de productos',
        icon: Package,
        route: '/administracion/parametros-generales/definicion-producto',
      },
    ],
  },
  {
    id: 'pacientes',
    title: 'Pacientes',
    subtitle: 'Gestión de pacientes',
    icon: Users,
    route: '/administracion/pacientes',
  },
];

export const getAllMenuItems = (): MenuItem[] => {
  const allItems: MenuItem[] = [];
  
  menuItems.forEach(item => {
    allItems.push(item);
    if (item.children) {
      allItems.push(...item.children);
    }
  });
  
  return allItems;
};

export const findMenuItemById = (id: string): MenuItem | undefined => {
  for (const item of menuItems) {
    if (item.id === id) return item;
    if (item.children) {
      const found = item.children.find(child => child.id === id);
      if (found) return found;
    }
  }
  return undefined;
};