import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { MessageSquare, ChevronDown, ChevronUp, User, Clock } from 'lucide-react-native';
import { Colors, Spacing, BorderRadius, FontSizes, FontWeights } from '@constants/theme';
import type { HistorialPedido } from '@models/Pedidos/Pedidos.types';

interface CampoObservacionesProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  historial?: HistorialPedido[];
  usuarioActualId?: number;
}

const CampoObservaciones: React.FC<CampoObservacionesProps> = ({
  value,
  onChange,
  placeholder = 'Escriba sus observaciones aquí...',
  label = 'Observaciones',
  maxLength = 500,
  required = false,
  disabled = false,
  historial = [],
  usuarioActualId,
}) => {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const mensajes = historial.filter(h => h.v_observaciones && h.v_observaciones.trim() !== '');

  const formatearFecha = (fecha: string) => {
    const date = new Date(fecha);
    const ahora = new Date();
    const diff = ahora.getTime() - date.getTime();
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(diff / 3600000);
    const dias = Math.floor(diff / 86400000);

    if (minutos < 1) return 'Ahora';
    if (minutos < 60) return `Hace ${minutos}m`;
    if (horas < 24) return `Hace ${horas}h`;
    if (dias === 1) return 'Ayer';
    if (dias < 7) return `Hace ${dias}d`;
    
    return date.toLocaleDateString('es-EC', { 
      day: '2-digit', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccionTexto = (accion: string) => {
    const acciones: Record<string, string> = {
      'SOLICITUD_CREADA': '📝 Solicitó',
      'APROBACION_A_COTIZANDO': '✅ Aprobó',
      'COTIZACION_COMPLETADA': '💰 Cotizó',
      'APROBACION_FINAL': '✅ Aprobó',
      'PEDIDO_RECHAZADO': '❌ Rechazó',
      'RECEPCION_COMPLETADA': '📦 Recibió'
    };
    return acciones[accion] || accion;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.labelContainer}>
          <MessageSquare size={16} color={Colors.text} />
          <Text style={styles.labelText}>
            {label} {required && <Text style={styles.required}>*</Text>}
          </Text>
        </View>

        {mensajes.length > 0 && (
          <TouchableOpacity
            onPress={() => setMostrarHistorial(!mostrarHistorial)}
            style={styles.historyButton}
          >
            <MessageSquare size={12} color="#1D4ED8" /> 
            <Text style={styles.historyButtonText}>
              Ver historial ({mensajes.length})
            </Text>
            {mostrarHistorial ? (
              <ChevronUp size={12} color="#1D4ED8" />
            ) : (
              <ChevronDown size={12} color="#1D4ED8" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {mostrarHistorial && mensajes.length > 0 && (
        <View style={styles.chatContainer}>
          <View style={styles.chatHeader}>
            <MessageSquare size={14} color={Colors.primary} />
            <Text style={styles.chatTitle}>Conversación del Pedido</Text>
          </View>

          <ScrollView style={styles.chatScroll} nestedScrollEnabled={true}>
            {mensajes.map((mensaje) => {
              const esMio = usuarioActualId === mensaje.iid_usuario;
              
              return (
                <View 
                  key={mensaje.iid_historial}
                  style={[
                    styles.messageRow,
                    esMio ? styles.messageRight : styles.messageLeft
                  ]}
                >
                  <View 
                    style={[
                      styles.messageBubble,
                      esMio ? styles.bubbleUser : styles.bubbleOther
                    ]}
                  >
                    <View style={styles.messageHeader}>
                      <User size={12} color={esMio ? '#BFDBFE' : Colors.textLight} />
                      <Text style={[styles.userName, esMio ? styles.textLightBlue : styles.textDark]}>
                        {mensaje.usuario_nombre}
                      </Text>
                      <Text style={[styles.actionText, esMio ? styles.textLightBlue : styles.textLight]}>
                        {getAccionTexto(mensaje.v_accion)}
                      </Text>
                    </View>
                    
                    <Text style={[styles.messageText, esMio ? styles.textWhite : styles.textDark]}>
                      {mensaje.v_observaciones}
                    </Text>
                    
                    <View style={styles.messageFooter}>
                      <Clock size={10} color={esMio ? '#BFDBFE' : Colors.textLight} />
                      <Text style={[styles.timeText, esMio ? styles.textLightBlue : styles.textLight]}>
                        {formatearFecha(mensaje.d_fecha_cambio)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        editable={!disabled}
        multiline={true}
        numberOfLines={4}
        textAlignVertical="top" 
        style={[
          styles.textArea,
          disabled && styles.textAreaDisabled
        ]}
        placeholderTextColor={Colors.placeholder}
      />
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {required ? 'Campo obligatorio' : 'Campo opcional'}
        </Text>
        <Text style={styles.footerText}>
          {value.length}/{maxLength} caracteres
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  labelText: {
    fontSize: FontSizes.sm,
    fontWeight: '500',
    color: Colors.text, 
  },
  required: {
    color: '#EF4444',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF', 
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  historyButtonText: {
    fontSize: FontSizes.xs,
    fontWeight: '500',
    color: '#1D4ED8', 
  },
  
  chatContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#BFDBFE', 
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
    maxHeight: 300,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: Spacing.xs,
    marginBottom: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: '#BFDBFE',
    gap: Spacing.xs,
  },
  chatTitle: {
    fontWeight: 'bold',
    fontSize: FontSizes.sm,
    color: '#1E3A8A', 
  },
  chatScroll: {
    flexGrow: 0,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  messageLeft: {
    justifyContent: 'flex-start',
  },
  messageRight: {
    justifyContent: 'flex-end',
  },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
  },
  bubbleUser: {
    backgroundColor: Colors.primary, 
  },
  bubbleOther: {
    backgroundColor: '#F3F4F6', 
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  userName: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
  },
  actionText: {
    fontSize: 10,
  },
  messageText: {
    fontSize: FontSizes.sm,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    justifyContent: 'flex-end',
  },
  timeText: {
    fontSize: 10,
  },
  
  textWhite: { color: '#FFFFFF' },
  textDark: { color: Colors.text },
  textLight: { color: '#6B7280' }, 
  textLightBlue: { color: '#BFDBFE' }, 

  textArea: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSizes.sm,
    color: Colors.text,
    backgroundColor: Colors.surface,
    minHeight: 100, 
  },
  textAreaDisabled: {
    backgroundColor: '#F3F4F6',
    color: '#9CA3AF',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  footerText: {
    fontSize: FontSizes.xs,
    color: '#6B7280', 
  },
});

export default CampoObservaciones;