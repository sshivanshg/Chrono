import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './widgets/widgetTaskHandler';

// Register the widget task handler
// This must be called at the app's entry point
registerWidgetTaskHandler(widgetTaskHandler);
