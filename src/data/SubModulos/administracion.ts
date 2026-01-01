import { 
  Package, 
  ClipboardList, 
  FileCheck, 
  Settings, 
  Users
} from 'lucide-react-native';

interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  route: string;
  children?: MenuItem[];
}

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
    id: 'estado-requisicion',
    title: 'Estado de Requisiciones',
    subtitle: 'Gestión de requisiciones',
    icon: FileCheck,
    route: '/administracion/estado-requisicion',
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
        title: 'Productos',
        subtitle: 'Gestión de productos',
        icon: Package,
        route: '/administracion/parametros-generales/productos',
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