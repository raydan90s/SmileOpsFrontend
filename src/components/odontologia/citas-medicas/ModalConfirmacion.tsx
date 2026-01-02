import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ModalConfirmacionProps {
  mostrar: boolean;
  titulo?: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  icono?: 'exito' | 'advertencia' | 'error' | 'pregunta';
  onConfirmar: () => void;
  onCancelar: () => void;
}

const ModalConfirmacion: React.FC<ModalConfirmacionProps> = ({
  mostrar,
  titulo = '¿Está seguro?',
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  icono = 'pregunta',
  onConfirmar,
  onCancelar,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (mostrar) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      Animated.sequence([
        Animated.delay(200),
        Animated.parallel([
          Animated.spring(iconScaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
          icono !== 'exito'
            ? Animated.sequence([
                Animated.timing(rotateAnim, {
                  toValue: 1,
                  duration: 300,
                  useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                  toValue: 0,
                  duration: 300,
                  useNativeDriver: true,
                }),
              ])
            : Animated.timing(rotateAnim, {
                toValue: 0,
                duration: 0,
                useNativeDriver: true,
              }),
        ]),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      iconScaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [mostrar, icono]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '10deg'],
  });

  const obtenerIcono = () => {
    const iconStyle = [
      styles.iconContainer,
      {
        transform: [{ scale: iconScaleAnim }, { rotate: rotation }],
      },
    ];

    switch (icono) {
      case 'exito':
        return (
          <Animated.View style={[iconStyle, styles.iconExito]}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path
                d="M5 13l4 4L19 7"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        );
      case 'advertencia':
        return (
          <Animated.View style={[iconStyle, styles.iconAdvertencia]}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        );
      case 'error':
        return (
          <Animated.View style={[iconStyle, styles.iconError]}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path
                d="M6 18L18 6M6 6l12 12"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        );
      case 'pregunta':
      default:
        return (
          <Animated.View style={[iconStyle, styles.iconPregunta]}>
            <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
              <Path
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="white"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Animated.View>
        );
    }
  };

  return (
    <Modal
      visible={mostrar}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <Pressable style={styles.overlay} onPress={onCancelar}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.iconWrapper}>{obtenerIcono()}</View>

            <Text style={styles.title}>{titulo}</Text>

            <Text style={styles.message}>{mensaje}</Text>

            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                onPress={onCancelar}
                style={styles.cancelButton}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>{textoCancelar}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onConfirmar}
                style={styles.confirmButton}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>{textoConfirmar}</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    maxWidth: 400,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  iconWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  iconExito: {
    backgroundColor: '#10B981',
  },
  iconAdvertencia: {
    backgroundColor: '#EAB308',
  },
  iconError: {
    backgroundColor: '#EF4444',
  },
  iconPregunta: {
    backgroundColor: '#3B82F6',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1F2937',
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ModalConfirmacion;