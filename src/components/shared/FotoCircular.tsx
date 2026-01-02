import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { User, Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, BorderRadius, FontSizes, Shadows } from '@constants/theme';

interface FotoCircularProps {
  onImageSelect: (file: any) => void; 
  resetKey?: number;
  hasImageError?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  existingImageUrl?: string;
}

const FotoCircular: React.FC<FotoCircularProps> = ({
  onImageSelect,
  resetKey = 0,
  hasImageError = false,
  size = 'md',
  showLabel = true,
  existingImageUrl
}) => {
  const [preview, setPreview] = useState<string | null>(null);

  const sizeMap = {
    sm: 96,  
    md: 128, 
    lg: 192, 
    xl: 256  
  };

  const currentSize = sizeMap[size];

  useEffect(() => {
    setPreview(null);
  }, [resetKey]);

  useEffect(() => {
    if (existingImageUrl && !preview) {
      setPreview(existingImageUrl);
    }
  }, [existingImageUrl, preview]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita acceso a la galería para seleccionar fotos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], 
        quality: 0.7,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        setPreview(asset.uri);
        
        const fileName = asset.uri.split('/').pop();
        const fileType = fileName?.split('.').pop();
        
        const fileObj = {
          uri: asset.uri,
          name: fileName,
          type: `image/${fileType}`,
        };
        
        onImageSelect(fileObj);
      }
    } catch (error) {
      console.error('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No se pudo seleccionar la imagen.');
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <View style={styles.container}>
      {showLabel && (
        <Text style={styles.label}>
          Fotografía {hasImageError && <Text style={styles.required}>*</Text>}
        </Text>
      )}

      <View style={[styles.imageWrapper, { width: currentSize, height: currentSize }]}>
        <View 
          style={[
            styles.imageContainer, 
            { 
              width: currentSize, 
              height: currentSize,
              borderColor: hasImageError ? Colors.error : Colors.border 
            }
          ]}
        >
          {preview ? (
            <Image 
              source={{ uri: preview }} 
              style={{ width: '100%', height: '100%' }} 
              resizeMode="cover"
            />
          ) : (
            <User 
              size={currentSize * 0.5} 
              color={Colors.placeholder} 
            />
          )}
        </View>

        {preview && (
          <TouchableOpacity 
            style={styles.removeButton} 
            onPress={handleRemoveImage}
          >
            <X size={16} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.button,
          preview ? styles.changeButton : styles.selectButton,
          size === 'sm' && { paddingVertical: 6, paddingHorizontal: 12 },
          size === 'xl' && { paddingVertical: 12, paddingHorizontal: 32 },
        ]}
        onPress={pickImage}
      >
        <Camera size={20} color="#FFFFFF" />
        <Text style={styles.buttonText}>
          {preview ? 'Cambiar Foto' : 'Seleccionar Foto'}
        </Text>
      </TouchableOpacity>

      {hasImageError && (
        <Text style={styles.errorText}>La fotografía es obligatoria</Text>
      )}

      {!preview && (
        <Text style={styles.hintText}>Seleccione una foto</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  required: {
    color: Colors.error,
  },
  imageWrapper: {
    position: 'relative',
  },
  imageContainer: {
    borderRadius: 9999, 
    overflow: 'hidden',
    borderWidth: 4,
    backgroundColor: '#F3F4F6', 
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.error, 
    borderRadius: 9999,
    padding: 6,
    zIndex: 10,
    ...Shadows.sm,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    gap: 8,
    ...Shadows.sm,
  },
  selectButton: {
    backgroundColor: Colors.primary, 
  },
  changeButton: {
    backgroundColor: '#4B5563', 
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: FontSizes.sm,
  },
  errorText: {
    fontSize: FontSizes.xs,
    color: Colors.error,
    fontWeight: '500',
    textAlign: 'center',
  },
  hintText: {
    fontSize: FontSizes.xs,
    color: Colors.textLight,
    textAlign: 'center',
  },
});

export default FotoCircular;