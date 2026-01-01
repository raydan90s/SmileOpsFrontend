import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Building2, MapPin } from 'lucide-react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

interface Establecimiento {
  tipo: 'Matriz' | 'Sucursal';
  direccion: string;
  numeroEstablecimiento: string;
}

interface DatosSRIProps {
  razonSocial: string;
  establecimientos: Establecimiento[];
}

export default function DatosSRI({ razonSocial, establecimientos }: DatosSRIProps) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>DATOS DEL SRI</Text>
      </View>

      <View style={styles.sectionContent}>
        {/* Razón Social */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Razón Social <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputDisabled}>
            <Text style={styles.inputDisabledText}>{razonSocial}</Text>
          </View>
        </View>

        {/* Establecimientos */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Establecimientos Activos ({establecimientos.length})
          </Text>
          
          <View style={styles.establecimientosList}>
            {establecimientos.map((est, index) => (
              <View key={index} style={styles.establecimientoCard}>
                <View style={styles.establecimientoContent}>
                  <View style={styles.iconContainer}>
                    {est.tipo === 'Matriz' ? (
                      <Building2 size={20} color={Colors.primary} />
                    ) : (
                      <MapPin size={20} color={Colors.textLight} />
                    )}
                  </View>

                  <View style={styles.establecimientoInfo}>
                    <View style={styles.establecimientoHeader}>
                      <View
                        style={[
                          styles.tipoBadge,
                          est.tipo === 'Matriz' ? styles.tipoBadgeMatriz : styles.tipoBadgeSucursal,
                        ]}
                      >
                        <Text
                          style={[
                            styles.tipoBadgeText,
                            est.tipo === 'Matriz' ? styles.tipoBadgeTextMatriz : styles.tipoBadgeTextSucursal,
                          ]}
                        >
                          {est.tipo}
                        </Text>
                      </View>

                      <Text style={styles.numeroEstablecimiento}>
                        Establecimiento: {est.numeroEstablecimiento}
                      </Text>
                    </View>

                    <Text style={styles.direccionText}>{est.direccion}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 2,
    borderColor: Colors.primary,
    overflow: 'hidden',
    marginBottom: Spacing.md,
  },
  sectionHeader: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.md,
    fontWeight: 'bold',
    color: Colors.textInverse,
  },
  sectionContent: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  required: {
    color: Colors.error,
  },
  inputDisabled: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  inputDisabledText: {
    fontSize: FontSizes.md,
    color: Colors.textLight,
  },
  establecimientosList: {
    gap: Spacing.sm,
  },
  establecimientoCard: {
    backgroundColor: Colors.backgroundLight,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  establecimientoContent: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  iconContainer: {
    marginTop: 2,
  },
  establecimientoInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  establecimientoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flexWrap: 'wrap',
  },
  tipoBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  tipoBadgeMatriz: {
    backgroundColor: `${Colors.primary}15`,
  },
  tipoBadgeSucursal: {
    backgroundColor: Colors.border,
  },
  tipoBadgeText: {
    fontSize: FontSizes.xs,
    fontWeight: 'bold',
  },
  tipoBadgeTextMatriz: {
    color: Colors.primary,
  },
  tipoBadgeTextSucursal: {
    color: Colors.text,
  },
  numeroEstablecimiento: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
  },
  direccionText: {
    fontSize: FontSizes.sm,
    color: Colors.text,
    lineHeight: 20,
  },
});