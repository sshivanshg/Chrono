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

// Widget Preview Component (mimics the actual widget appearance)
function WidgetPreview({
    eventTitle = 'No upcoming events',
    daysLeft = 0,
    eventDate = '',
}: {
    eventTitle?: string;
    daysLeft?: number;
    eventDate?: string;
}) {
    const hasEvent = eventTitle !== 'No upcoming events';

    return (
        <View style={widgetStyles.container}>
            {/* App name */}
            <Text style={widgetStyles.appName}>CHRONO</Text>

            {hasEvent ? (
                <>
                    {/* Days countdown */}
                    <View style={widgetStyles.countdownRow}>
                        <Text style={widgetStyles.daysNumber}>{daysLeft}</Text>
                        <Text style={widgetStyles.daysLabel}>
                            {daysLeft === 1 ? ' DAY' : ' DAYS'}
                        </Text>
                    </View>

                    {/* Event title */}
                    <Text style={widgetStyles.eventTitle} numberOfLines={1}>
                        {eventTitle}
                    </Text>

                    {/* Event date */}
                    <Text style={widgetStyles.eventDate}>{eventDate}</Text>
                </>
            ) : (
                <>
                    <Text style={widgetStyles.noEvents}>No upcoming events</Text>
                    <Text style={widgetStyles.tapToAdd}>Tap to add one</Text>
                </>
            )}
        </View>
    );
}

export default function WidgetPreviewScreen() {
    const router = useRouter();
    const { events } = useEvents();
    const [previewData, setPreviewData] = useState({
        title: 'No upcoming events',
        daysLeft: 0,
        dateStr: '',
    });

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
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f5f5f7" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Widget Preview</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Info */}
                <View style={styles.infoSection}>
                    <Ionicons name="information-circle" size={24} color="#6c63ff" />
                    <Text style={styles.infoText}>
                        This is a preview of how your home screen widget will look. The actual
                        widget requires a production build to test.
                    </Text>
                </View>

                {/* Widget Preview with Data */}
                <Text style={styles.sectionTitle}>With Upcoming Event</Text>
                <View style={styles.widgetWrapper}>
                    <WidgetPreview
                        eventTitle={previewData.title !== 'No upcoming events' ? previewData.title : "Kate's Birthday"}
                        daysLeft={previewData.daysLeft || 28}
                        eventDate={previewData.dateStr || 'Sat, Feb 14'}
                    />
                </View>

                {/* Widget Preview Empty State */}
                <Text style={styles.sectionTitle}>Empty State</Text>
                <View style={styles.widgetWrapper}>
                    <WidgetPreview />
                </View>

                {/* Widget Sizes */}
                <Text style={styles.sectionTitle}>Small Widget (2x1)</Text>
                <View style={[styles.widgetWrapper, { width: 180, height: 110 }]}>
                    <WidgetPreview
                        eventTitle="Birthday"
                        daysLeft={5}
                        eventDate="Mon, Jan 20"
                    />
                </View>

                {/* Instructions */}
                <View style={styles.instructionsSection}>
                    <Text style={styles.instructionsTitle}>How to add widget on Android:</Text>
                    <Text style={styles.instruction}>1. Long press on home screen</Text>
                    <Text style={styles.instruction}>2. Select "Widgets"</Text>
                    <Text style={styles.instruction}>3. Find "Chrono"</Text>
                    <Text style={styles.instruction}>4. Drag "Countdown Widget" to home</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const widgetStyles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a2e',
        borderRadius: 24,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
    appName: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6c63ff',
        letterSpacing: 2,
        marginBottom: 8,
    },
    countdownRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 4,
    },
    daysNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    daysLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#888888',
        marginLeft: 4,
        marginBottom: 8,
    },
    eventTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 4,
    },
    eventDate: {
        fontSize: 12,
        color: '#888888',
        textAlign: 'center',
    },
    noEvents: {
        fontSize: 16,
        color: '#888888',
        textAlign: 'center',
        marginBottom: 8,
    },
    tapToAdd: {
        fontSize: 14,
        color: '#6c63ff',
        textAlign: 'center',
    },
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
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
        backgroundColor: '#e8e6ff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
        alignItems: 'flex-start',
        gap: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    widgetWrapper: {
        width: 280,
        height: 160,
        marginBottom: 24,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    instructionsSection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 40,
    },
    instructionsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    instruction: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
        paddingLeft: 8,
    },
});
