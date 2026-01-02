export interface MenuItem {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  route: string;
  children?: MenuItem[];
}