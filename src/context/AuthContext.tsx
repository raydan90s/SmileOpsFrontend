import { createContext, useState, useContext, type ReactNode, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Usuario } from "@models/Login/usuario.types";
import type { Permisos } from "@models/Login/permisos.types";
import { fetchUserFromToken, loginUser } from "@services/Login/auth.service";

interface AuthContextType {
  usuario: Usuario | null;
  permisos: Permisos | null;
  loading: boolean;
  login: (vUsuario: string, vClave: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  usuario: null,
  permisos: null,
  loading: true,
  login: async () => false,
  logout: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [permisos, setPermisos] = useState<Permisos | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (vUsuario: string, vClave: string): Promise<boolean> => {
    setLoading(true);
    try {
      const data = await loginUser(vUsuario, vClave);
      if (data) {
        setUsuario(data.usuario);
        setPermisos(data.permisos);
        await AsyncStorage.setItem("token", data.token);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const data = await fetchUserFromToken(token);
          if (data) {
            setUsuario(data.usuario);
            setPermisos(data.permisos);
          } else {
            await AsyncStorage.removeItem("token");
          }
        }
      } catch (error) {
        console.error("Error al verificar token:", error);
        await AsyncStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const logout = async () => {
    try {
      setUsuario(null);
      setPermisos(null);
      await AsyncStorage.removeItem("token");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, permisos, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);