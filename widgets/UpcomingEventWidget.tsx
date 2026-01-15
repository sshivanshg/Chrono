import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

// Theme colors matching the app's design system
const WidgetTheme = {
    // Light theme (default - matches app's light mode)
    light: {
        background: '#ffffff',
        cardBackground: '#f5f5f7',
        text: '#11181C',
        textSecondary: '#687076',
        accent: '#000000',
        border: '#e0e0e0',
    },
    // Dark theme (matches app's dark mode)
    dark: {
        background: '#151718',
        cardBackground: '#1c1c1e',
        text: '#ECEDEE',
        textSecondary: '#9BA1A6',
        accent: '#ffffff',
        border: '#333333',
    },
};

interface UpcomingEventWidgetProps {
    eventTitle?: string;
    monthsLeft?: number;
    daysLeft?: number;
    eventDate?: string;
    isDarkMode?: boolean;
}

export function UpcomingEventWidget({
    eventTitle = 'No upcoming events',
    monthsLeft = 0,
    daysLeft = 0,
    eventDate = '',
    isDarkMode = false,
}: UpcomingEventWidgetProps) {
    const hasEvent = eventTitle !== 'No upcoming events';
    const theme = isDarkMode ? WidgetTheme.dark : WidgetTheme.light;

    // Logic to determine what to show
    const showMonths = monthsLeft > 0;

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: theme.cardBackground as any,
                borderRadius: 28,
                padding: 16,
            }}
        >
            {hasEvent ? (
                <>
                    {/* Countdown Display */}
                    <FlexWidget
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            marginBottom: 8,
                        }}
                    >
                        {showMonths ? (
                            <>
                                {/* Months */}
                                <TextWidget
                                    text={String(monthsLeft)}
                                    style={{
                                        fontSize: 48,
                                        fontWeight: 'bold',
                                        color: theme.text as any,
                                    }}
                                />
                                <TextWidget
                                    text={monthsLeft === 1 ? ' MO' : ' MOS'}
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: theme.textSecondary as any,
                                        marginLeft: 2,
                                        marginRight: 8,
                                    }}
                                />
                                {/* Days (remainder) */}
                                <TextWidget
                                    text={String(daysLeft)}
                                    style={{
                                        fontSize: 48,
                                        fontWeight: 'bold',
                                        color: theme.text as any,
                                    }}
                                />
                                <TextWidget
                                    text={daysLeft === 1 ? ' DAY' : ' DAYS'}
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: theme.textSecondary as any,
                                        marginLeft: 2,
                                    }}
                                />
                            </>
                        ) : (
                            <>
                                {/* Just Days */}
                                <TextWidget
                                    text={String(daysLeft)}
                                    style={{
                                        fontSize: 56,
                                        fontWeight: 'bold',
                                        color: theme.text as any,
                                    }}
                                />
                                <TextWidget
                                    text={daysLeft === 1 ? ' DAY' : ' DAYS'}
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '600',
                                        color: theme.textSecondary as any,
                                        marginLeft: 4,
                                    }}
                                />
                            </>
                        )}
                    </FlexWidget>

                    {/* Event title */}
                    <TextWidget
                        text={eventTitle}
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: theme.text as any,
                            textAlign: 'center',
                            marginBottom: 4,
                        }}
                        truncate="END"
                        maxLines={1}
                    />

                    {/* Event date */}
                    <TextWidget
                        text={eventDate}
                        style={{
                            fontSize: 13,
                            color: theme.textSecondary as any,
                            textAlign: 'center',
                        }}
                    />
                </>
            ) : (
                <>
                    {/* Empty state icon placeholder */}
                    <TextWidget
                        text="📅"
                        style={{
                            fontSize: 32,
                            marginBottom: 8,
                        }}
                    />

                    {/* No events message */}
                    <TextWidget
                        text="No upcoming events"
                        style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: theme.text as any,
                            textAlign: 'center',
                            marginBottom: 4,
                        }}
                    />
                    <TextWidget
                        text="Tap to add one"
                        style={{
                            fontSize: 13,
                            color: theme.textSecondary as any,
                            textAlign: 'center',
                        }}
                    />
                </>
            )}
        </FlexWidget>
    );
}
