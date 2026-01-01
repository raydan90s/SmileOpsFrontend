import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '@constants/theme';

interface PaginacionProps {
  paginaActual: number;
  totalPaginas: number;
  indiceInicio: number;
  indiceFin: number;
  totalItems: number;
  onCambiarPagina: (pagina: number) => void;
  nombreEntidad?: string;
}

export default function Paginacion({
  paginaActual,
  totalPaginas,
  indiceInicio,
  indiceFin,
  totalItems,
  onCambiarPagina,
  nombreEntidad = 'items'
}: PaginacionProps) {
  const renderPageNumbers = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPaginas; i++) {
      if (
        i === 1 ||
        i === totalPaginas ||
        (i >= paginaActual - 1 && i <= paginaActual + 1)
      ) {
        pages.push(
          <TouchableOpacity
            key={i}
            onPress={() => onCambiarPagina(i)}
            style={[
              styles.pageButton,
              i === paginaActual && styles.pageButtonActive
            ]}
          >
            <Text style={[
              styles.pageButtonText,
              i === paginaActual && styles.pageButtonTextActive
            ]}>
              {i}
            </Text>
          </TouchableOpacity>
        );
      } else if (i === paginaActual - 2 || i === paginaActual + 2) {
        pages.push(
          <Text key={i} style={styles.ellipsis}>
            ...
          </Text>
        );
      }
    }
    
    return pages;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.infoText}>
        Mostrando <Text style={styles.bold}>{indiceInicio + 1}</Text> a{' '}
        <Text style={styles.bold}>{Math.min(indiceFin, totalItems)}</Text> de{' '}
        <Text style={styles.bold}>{totalItems}</Text> {nombreEntidad}
      </Text>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => onCambiarPagina(paginaActual - 1)}
          disabled={paginaActual === 1}
          style={[
            styles.navButton,
            paginaActual === 1 && styles.navButtonDisabled
          ]}
        >
          <Text style={[
            styles.navButtonText,
            paginaActual === 1 && styles.navButtonTextDisabled
          ]}>
            Anterior
          </Text>
        </TouchableOpacity>

        <View style={styles.pageNumbers}>
          {renderPageNumbers()}
        </View>

        <TouchableOpacity
          onPress={() => onCambiarPagina(paginaActual + 1)}
          disabled={paginaActual === totalPaginas}
          style={[
            styles.navButton,
            paginaActual === totalPaginas && styles.navButtonDisabled
          ]}
        >
          <Text style={[
            styles.navButtonText,
            paginaActual === totalPaginas && styles.navButtonTextDisabled
          ]}>
            Siguiente
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 2,
    borderTopColor: Colors.border,
  },
  infoText: {
    fontSize: FontSizes.sm,
    color: Colors.textLight,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  bold: {
    fontWeight: '600',
    color: Colors.text,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  navButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  navButtonTextDisabled: {
    color: Colors.textLight,
  },
  pageNumbers: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  pageButton: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    borderColor: Colors.border,
    minWidth: 32,
    alignItems: 'center',
  },
  pageButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pageButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text,
  },
  pageButtonTextActive: {
    color: Colors.textInverse,
  },
  ellipsis: {
    paddingHorizontal: Spacing.xs,
    color: Colors.textLight,
  },
});