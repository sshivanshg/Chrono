import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { UpcomingEventWidget } from './UpcomingEventWidget';

const WIDGET_NAME = 'UpcomingEventWidget';

// Calculate detailed time left
function getTimeLeft(eventDate: Date): { months: number; days: number; totalDays: number } {
    const now = new Date();
    // Normalize to start of day for cleaner calculation
    now.setHours(0, 0, 0, 0);
    const target = new Date(eventDate);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - now.getTime();
    const totalDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    // Calculate months and days
    let months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
    let days = target.getDate() - now.getDate();

    if (days < 0) {
        months--;
        // Get days in previous month
        const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
        days += prevMonth.getDate();
    }

    return {
        months: Math.max(0, months),
        days: Math.max(0, days),
        totalDays
    };
}

// Format date for display
function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

// Fetch the next upcoming event from storage
async function getUpcomingEvent(): Promise<{
    title: string;
    timeLeft: { months: number; days: number; totalDays: number };
    dateStr: string;
} | null> {
    try {
        const eventsJson = await AsyncStorage.getItem('events');
        if (!eventsJson) return null;

        const events = JSON.parse(eventsJson);
        const now = new Date();

        // Filter and sort upcoming events
        const upcomingEvents = events
            .filter((event: any) => new Date(event.date) > now)
            .sort((a: any, b: any) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            );

        if (upcomingEvents.length === 0) return null;

        const nextEvent = upcomingEvents[0];
        const eventDate = new Date(nextEvent.date);

        return {
            title: nextEvent.title,
            timeLeft: getTimeLeft(eventDate),
            dateStr: formatDate(eventDate),
        };
    } catch (error) {
        console.error('Error fetching event for widget:', error);
        return null;
    }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const widgetInfo = props.widgetInfo;
    const Widget = props.renderWidget;

    switch (props.widgetAction) {
        case 'WIDGET_ADDED':
        case 'WIDGET_UPDATE':
        case 'WIDGET_RESIZED':
            // Fetch the upcoming event data
            const eventData = await getUpcomingEvent();

            // Render the widget
            if (eventData) {
                Widget(
                    <UpcomingEventWidget
                        eventTitle={eventData.title}
                        monthsLeft={eventData.timeLeft.months}
                        daysLeft={eventData.timeLeft.days}
                        eventDate={eventData.dateStr}
                    />
                );
            } else {
                Widget(<UpcomingEventWidget />);
            }
            break;

        case 'WIDGET_DELETED':
            // Clean up if needed
            break;

        case 'WIDGET_CLICK':
            // Handle widget click - could open the app to a specific event
            // This requires additional native configuration
            break;

        default:
            break;
    }
}
