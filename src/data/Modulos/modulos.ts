import { 
  Users, 
  Smile, 
  Package, 
} from 'lucide-react-native';

export type ModuleKey = 
  | 'administracion'
  | 'odontologia'
  | 'inventario'

export interface Module {
  key: ModuleKey;
  name: string;
  icon: any;
  color: string;
}

export const allModules: Module[] = [
  { key: 'administracion', name: 'Administración', icon: Users, color: '#2e2f93' },
  { key: 'odontologia', name: 'Odontología', icon: Smile, color: '#2e2f93' },
  { key: 'inventario', name: 'Inventario', icon: Package, color: '#2e2f93' },
];