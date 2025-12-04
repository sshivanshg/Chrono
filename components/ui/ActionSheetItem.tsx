import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ThemedText } from '../themed-text';

interface ActionSheetItemProps {
    label: string;
    icon: React.ReactNode;
    onPress?: () => void;
    isDestructive?: boolean;
    isPro?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
}

export function ActionSheetItem({
    label,
    icon,
    onPress,
    isDestructive,
    isPro,
    disabled,
    style,
}: ActionSheetItemProps) {
    // Force dark text since the action sheet has a white background
    const textColor = '#111';
    const destructiveColor = '#E53935';
    const disabledColor = '#999';
    const borderBottomColor = '#f0f0f0';

    const content = (
        <View style={[styles.container, { borderBottomColor }, style]}>
            <View style={[styles.iconBox, isDestructive && { backgroundColor: '#FFEBEE' }]}>
                {icon}
            </View>
            <ThemedText
                style={[
                    styles.label,
                    { color: isDestructive ? destructiveColor : (disabled ? disabledColor : textColor) }
                ]}
            >
                {label}
            </ThemedText>
            {isPro && (
                <View style={styles.proBadge}>
                    <ThemedText style={styles.proBadgeText}>PRO</ThemedText>
                </View>
            )}
        </View>
    );

    if (disabled) {
        return <View style={{ opacity: 0.6 }}>{content}</View>;
    }

    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
            {content}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
    },
    iconBox: {
        width: 28,
        height: 28,
        borderRadius: 6,
        backgroundColor: '#F4F4F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    label: {
        fontSize: 16,
        flex: 1,
    },
    proBadge: {
        borderWidth: 1,
        borderColor: '#e5e5e5',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        backgroundColor: '#f7f7f7',
    },
    proBadgeText: {
        fontSize: 10,
        color: '#9a9a9a',
        fontWeight: '700',
    },
});
