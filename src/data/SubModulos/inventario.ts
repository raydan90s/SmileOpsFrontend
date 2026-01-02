import { 
  ShoppingCart, 
  ClipboardList, 
  PlusCircle, 
  FileText, 
  Search,
  Package
} from 'lucide-react-native';
import { MenuItem } from '@models/MenuItem/MenuItem.types';

export const menuItems: MenuItem[] = [
  {
    id: 'pedidos',
    title: 'Pedidos',
    subtitle: 'Gestión de órdenes y pedidos',
    icon: ShoppingCart,
    route: '/inventario/pedidos',
    children: [
      {
        id: 'estado-pedidos-ayudante',
        title: 'Estado de Pedidos',
        subtitle: 'Seguimiento de pedidos',
        icon: ClipboardList,
        route: '/inventario/pedidos/estado',
      },
      {
        id: 'solicitar-ordenes-pedidos',
        title: 'Solicitar Pedidos',
        subtitle: 'Crear nueva orden',
        icon: PlusCircle,
        route: '/inventario/pedidos/solicitar',
      },
    ],
  },
  {
    id: 'consultaMovimientoProductoEntregado',
    title: 'Consulta Movimiento',
    subtitle: 'Producto Entregado',
    icon: Search,
    route: '/inventario/consulta-movimiento',
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