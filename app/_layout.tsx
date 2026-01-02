import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@context/AuthContext';
import { DoctorProvider } from '@context/DoctorContext';
import { ConsultoriosProvider } from '@context/ConsultoriosContext';
import { BodegasProvider } from '@context/BodegasContext';
import { PaisesProvider } from '@context/PaisesContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <DoctorProvider>
          <ConsultoriosProvider>
            <BodegasProvider>
              <PaisesProvider>
                <Stack screenOptions={{ headerShown: false }} />
              </PaisesProvider>
            </BodegasProvider>
          </ConsultoriosProvider>
        </DoctorProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}