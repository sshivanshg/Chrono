import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useEvents } from '../contexts/EventContext';
import { useTheme } from '../contexts/ThemeContext';

// Theme colors matching the app's design system
const WidgetTheme = {
    light: {
        background: '#ffffff',
        cardBackground: '#f5f5f7',
        text: '#11181C',
        textSecondary: '#687076',
        accent: '#000000',
    },
    dark: {
        background: '#151718',
        cardBackground: '#1c1c1e',
        text: '#ECEDEE',
        textSecondary: '#9BA1A6',
        accent: '#ffffff',
    },
};

// Widget Preview Component (mimics the actual widget appearance)
function WidgetPreview({
    eventTitle = 'No upcoming events',
    daysLeft = 0,
    eventDate = '',
    isDarkMode = false,
}: {
    eventTitle?: string;
    daysLeft?: number;
    eventDate?: string;
    isDarkMode?: boolean;
}) {
    const hasEvent = eventTitle !== 'No upcoming events';
    const theme = isDarkMode ? WidgetTheme.dark : WidgetTheme.light;

    return (
        <View style={[widgetStyles.container, { backgroundColor: theme.cardBackground }]}>
            {/* App name badge */}
            <View style={[widgetStyles.appBadge, { backgroundColor: theme.accent }]}>
                <Text style={[widgetStyles.appName, { color: isDarkMode ? '#000' : '#fff' }]}>
                    CHRONO
                </Text>
            </View>

            {hasEvent ? (
                <>
                    {/* Days countdown */}
                    <View style={widgetStyles.countdownRow}>
                        <Text style={[widgetStyles.daysNumber, { color: theme.text }]}>
                            {daysLeft}
                        </Text>
                        <Text style={[widgetStyles.daysLabel, { color: theme.textSecondary }]}>
                            {daysLeft === 1 ? ' DAY' : ' DAYS'}
                        </Text>
                    </View>

                    {/* Event title */}
                    <Text
                        style={[widgetStyles.eventTitle, { color: theme.text }]}
                        numberOfLines={1}
                    >
                        {eventTitle}
                    </Text>

                    {/* Event date */}
                    <Text style={[widgetStyles.eventDate, { color: theme.textSecondary }]}>
                        {eventDate}
                    </Text>
                </>
            ) : (
                <>
                    <Text style={widgetStyles.emptyIcon}>📅</Text>
                    <Text style={[widgetStyles.noEvents, { color: theme.text }]}>
                        No upcoming events
                    </Text>
                    <Text style={[widgetStyles.tapToAdd, { color: theme.textSecondary }]}>
                        Tap to add one
                    </Text>
                </>
            )}
        </View>
    );
}

export default function WidgetPreviewScreen() {
    const router = useRouter();
    const { events } = useEvents();
    const { colorScheme } = useTheme();
    const [previewData, setPreviewData] = useState({
        title: 'No upcoming events',
        daysLeft: 0,
        dateStr: '',
    });

    const isDark = colorScheme === 'dark';

    useEffect(() => {
        // Find the next upcoming event
        const now = new Date();
        const upcomingEvents = events
            .filter((event) => new Date(event.date) > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        if (upcomingEvents.length > 0) {
            const nextEvent = upcomingEvents[0];
            const eventDate = new Date(nextEvent.date);
            const diffTime = eventDate.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            setPreviewData({
                title: nextEvent.title,
                daysLeft: Math.max(0, diffDays),
                dateStr: eventDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                }),
            });
        }
    }, [events]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#151718' : '#f5f5f7' }]}>
            <StatusBar
                barStyle={isDark ? 'light-content' : 'dark-content'}
                backgroundColor={isDark ? '#151718' : '#f5f5f7'}
            />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#333' : '#e0e0e0' }]}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={[styles.backButton, { backgroundColor: isDark ? '#333' : '#fff' }]}
                >
                    <Ionicons name="arrow-back" size={24} color={isDark ? '#fff' : '#000'} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
                    Widget Preview
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Info */}
                <View style={[styles.infoSection, { backgroundColor: isDark ? '#1c1c1e' : '#e8e6ff' }]}>
                    <Ionicons name="information-circle" size={24} color={isDark ? '#9BA1A6' : '#6c63ff'} />
                    <Text style={[styles.infoText, { color: isDark ? '#9BA1A6' : '#333' }]}>
                        This is a preview of how your home screen widget will look.
                        The widget matches your current theme.
                    </Text>
                </View>

                {/* Light Theme Widget */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
                    Light Theme
                </Text>
                <View style={styles.widgetWrapper}>
                    <WidgetPreview
                        eventTitle={previewData.title !== 'No upcoming events' ? previewData.title : "Kate's Birthday"}
                        daysLeft={previewData.daysLeft || 28}
                        eventDate={previewData.dateStr || 'Sat, Feb 14'}
                        isDarkMode={false}
                    />
                </View>

                {/* Dark Theme Widget */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
                    Dark Theme
                </Text>
                <View style={styles.widgetWrapper}>
                    <WidgetPreview
                        eventTitle={previewData.title !== 'No upcoming events' ? previewData.title : "Kate's Birthday"}
                        daysLeft={previewData.daysLeft || 28}
                        eventDate={previewData.dateStr || 'Sat, Feb 14'}
                        isDarkMode={true}
                    />
                </View>

                {/* Empty State */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
                    Empty State
                </Text>
                <View style={styles.widgetWrapper}>
                    <WidgetPreview isDarkMode={isDark} />
                </View>

                {/* Small Widget */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#333' }]}>
                    Small Widget (2x1)
                </Text>
                <View style={[styles.widgetWrapper, { width: 180, height: 110 }]}>
                    <WidgetPreview
                        eventTitle="Birthday"
                        daysLeft={5}
                        eventDate="Mon, Jan 20"
                        isDarkMode={isDark}
                    />
                </View>

                {/* Instructions */}
                <View style={[styles.instructionsSection, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
                    <Text style={[styles.instructionsTitle, { color: isDark ? '#fff' : '#333' }]}>
                        How to add widget on Android:
                    </Text>
                    <Text style={[styles.instruction, { color: isDark ? '#9BA1A6' : '#666' }]}>
                        1. Long press on home screen
                    </Text>
                    <Text style={[styles.instruction, { color: isDark ? '#9BA1A6' : '#666' }]}>
                        2. Select "Widgets"
                    </Text>
                    <Text style={[styles.instruction, { color: isDark ? '#9BA1A6' : '#666' }]}>
                        3. Find "Chrono"
                    </Text>
                    <Text style={[styles.instruction, { color: isDark ? '#9BA1A6' : '#666' }]}>
                        4. Drag "Countdown Widget" to home
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const widgetStyles = StyleSheet.create({
    container: {
        borderRadius: 28,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    appBadge: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12,
    },
    appName: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    countdownRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 8,
    },
    daysNumber: {
        fontSize: 56,
        fontWeight: 'bold',
    },
    daysLabel: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
        marginBottom: 10,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    eventDate: {
        fontSize: 13,
        textAlign: 'center',
    },
    emptyIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    noEvents: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 4,
    },
    tapToAdd: {
        fontSize: 13,
        textAlign: 'center',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    infoSection: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        alignItems: 'flex-start',
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    widgetWrapper: {
        width: 280,
        height: 170,
        marginBottom: 24,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    instructionsSection: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 40,
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    instruction: {
        fontSize: 14,
        marginBottom: 8,
        paddingLeft: 8,
    },
});
