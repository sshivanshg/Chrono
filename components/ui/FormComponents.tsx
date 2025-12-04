import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, ViewStyle } from 'react-native';
import { ThemedText } from '../themed-text';

interface InputSectionProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
    numberOfLines?: number;
    style?: ViewStyle;
}

export function InputSection({
    label,
    value,
    onChangeText,
    placeholder,
    multiline,
    numberOfLines,
    style
}: InputSectionProps) {
    const borderColor = useThemeColor({}, 'border');
    const inputBg = useThemeColor({}, 'inputBackground');
    const textColor = useThemeColor({}, 'text');
    const placeholderColor = '#999'; // Could be themed too

    return (
        <View style={[styles.section, { borderBottomColor: borderColor }, style]}>
            <ThemedText type="defaultSemiBold" style={styles.label}>{label}</ThemedText>
            <TextInput
                style={[
                    styles.input,
                    {
                        borderColor,
                        backgroundColor: inputBg,
                        color: textColor,
                        height: multiline ? 80 : undefined,
                        textAlignVertical: multiline ? 'top' : 'center'
                    }
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={placeholderColor}
                multiline={multiline}
                numberOfLines={numberOfLines}
            />
        </View>
    );
}

interface ToggleSectionProps {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export function ToggleSection({ label, value, onValueChange }: ToggleSectionProps) {
    const borderColor = useThemeColor({}, 'border');
    const tintColor = useThemeColor({}, 'tint');

    return (
        <View style={[styles.section, { borderBottomColor: borderColor, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
            <ThemedText type="defaultSemiBold">{label}</ThemedText>
            <TouchableOpacity
                style={[styles.toggle, { backgroundColor: value ? tintColor : '#e0e0e0' }]}
                onPress={() => onValueChange(!value)}
            >
                <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
            </TouchableOpacity>
        </View>
    );
}

interface DateSectionProps {
    date: Date;
}

export function DateSection({ date }: DateSectionProps) {
    const borderColor = useThemeColor({}, 'border');

    return (
        <View style={[styles.section, { borderBottomColor: borderColor }]}>
            <ThemedText style={styles.dateLabel}>Date</ThemedText>
            <ThemedText type="subtitle">
                {date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                })}
            </ThemedText>
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        paddingVertical: 20,
        borderBottomWidth: 1,
    },
    label: {
        marginBottom: 12,
    },
    dateLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
    },
    toggle: {
        width: 50,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        paddingHorizontal: 2,
    },
    toggleThumb: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleThumbActive: {
        alignSelf: 'flex-end',
    },
});
