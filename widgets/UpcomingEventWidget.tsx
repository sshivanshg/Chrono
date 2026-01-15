import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

interface UpcomingEventWidgetProps {
    eventTitle?: string;
    daysLeft?: number;
    eventDate?: string;
}

export function UpcomingEventWidget({
    eventTitle = 'No upcoming events',
    daysLeft = 0,
    eventDate = '',
}: UpcomingEventWidgetProps) {
    const hasEvent = eventTitle !== 'No upcoming events';

    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1a1a2e',
                borderRadius: 24,
                padding: 16,
            }}
        >
            {/* App name */}
            <TextWidget
                text="CHRONO"
                style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: '#6c63ff',
                    letterSpacing: 2,
                    marginBottom: 8,
                }}
            />

            {hasEvent ? (
                <>
                    {/* Days countdown */}
                    <FlexWidget
                        style={{
                            flexDirection: 'row',
                            alignItems: 'flex-end',
                            marginBottom: 4,
                        }}
                    >
                        <TextWidget
                            text={String(daysLeft)}
                            style={{
                                fontSize: 48,
                                fontWeight: 'bold',
                                color: '#ffffff',
                            }}
                        />
                        <TextWidget
                            text={daysLeft === 1 ? ' DAY' : ' DAYS'}
                            style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: '#888888',
                                marginLeft: 4,
                            }}
                        />
                    </FlexWidget>

                    {/* Event title */}
                    <TextWidget
                        text={eventTitle}
                        style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#ffffff',
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
                            fontSize: 12,
                            color: '#888888',
                            textAlign: 'center',
                        }}
                    />
                </>
            ) : (
                <>
                    {/* No events message */}
                    <TextWidget
                        text="No upcoming events"
                        style={{
                            fontSize: 16,
                            color: '#888888',
                            textAlign: 'center',
                            marginBottom: 8,
                        }}
                    />
                    <TextWidget
                        text="Tap to add one"
                        style={{
                            fontSize: 14,
                            color: '#6c63ff',
                            textAlign: 'center',
                        }}
                    />
                </>
            )}
        </FlexWidget>
    );
}
