import React, { useEffect, useRef } from 'react';
import {
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Pressable,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Theme from '@constants/theme';
interface ModalExitoProps {
  isOpen: boolean;
  onClose: () => void;
  mensaje: string;
  titulo?: string;
}

const ModalExito: React.FC<ModalExitoProps> = ({
  isOpen,
  onClose,
  mensaje,
  titulo = '¡Felicitaciones!',
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      Animated.sequence([
        Animated.delay(200),
        Animated.spring(iconScaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      iconScaleAnim.setValue(0);
    }
  }, [isOpen]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              styles.container,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <Animated.View
              style={[
                styles.iconContainer,
                styles.successIcon,
                {
                  transform: [{ scale: iconScaleAnim }],
                },
              ]}
            >
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

            <Text style={styles.title}>{titulo}</Text>

            <Text style={styles.message}>{mensaje}</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>
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
    padding: Theme.spacing.md,
  },
  container: {
    backgroundColor: Theme.colors.surface,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.xl,
    maxWidth: 400,
    width: '100%',
    ...Theme.shadows.xl,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: Theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.md,
  },
  successIcon: {
    backgroundColor: Theme.colors.success,
  },
  title: {
    fontSize: Theme.fontSizes.xxl,
    fontWeight: Theme.fontWeights.bold,
    textAlign: 'center',
    color: Theme.colors.text,
    marginBottom: Theme.spacing.md,
  },
  message: {
    fontSize: Theme.fontSizes.md,
    textAlign: 'center',
    color: Theme.colors.placeholder,
    marginBottom: Theme.spacing.lg,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Theme.colors.primary,
    paddingVertical: Theme.spacing.sm + 6,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    ...Theme.shadows.sm,
  },
  buttonText: {
    color: Theme.colors.textInverse,
    fontSize: Theme.fontSizes.md,
    fontWeight: Theme.fontWeights.semibold,
    textAlign: 'center',
  },
});

export default ModalExito;