import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { Colors, Spacing, FontSizes } from '@constants/theme';

interface CardListProps<T> {
    data: T[];
    renderItem: (item: T) => React.ReactNode;
    keyExtractor: (item: T) => string;
    emptyIcon?: LucideIcon;
    emptyTitle?: string;
    emptySubtitle?: string;
}

export default function CardList<T>({
    data,
    renderItem,
    keyExtractor,
    emptyIcon: EmptyIcon,
    emptyTitle = 'No hay registros',
    emptySubtitle = 'Comience agregando un nuevo elemento',
}: CardListProps<T>) {
    if (data.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                {EmptyIcon && <EmptyIcon size={64} color={Colors.borderLight} />}
                <Text style={styles.emptyTitle}>{emptyTitle}</Text>
                <Text style={styles.emptySubtitle}>{emptySubtitle}</Text>
            </View>
        );
    }

    return (
        <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={({ item }) => <>{renderItem(item)}</>}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
        />
    );
}

const styles = StyleSheet.create({
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
        minHeight: 200,
    },
    emptyTitle: {
        fontSize: FontSizes.lg,
        color: Colors.textLight,
        marginTop: Spacing.md,
        marginBottom: Spacing.xs,
        fontWeight: '600',
    },
    emptySubtitle: {
        fontSize: FontSizes.sm,
        color: Colors.placeholder,
        textAlign: 'center',
    },
    listContent: {
        padding: Spacing.md,
    },
});
