import 'react-native-gesture-handler';
import { NavigationContainer } from "@react-navigation/native";
import { BottomNavigation } from "./src/navigation/BottomNavigation";
import { WalletProvider } from './src/context/WalletContext';
import Toast from 'react-native-toast-message';
import { TransactionProvider } from './src/context/TransactionContext';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';

/* import * as SplashScreen from 'expo-splash-screen'; */

export default function App() {

  const [fontsLoaded] = useFonts({
    Regular: require('./assets/fonts/Nunito-Regular.ttf'),
    Bold: require('./assets/fonts/Nunito-Bold.ttf'),
  })

  if (!fontsLoaded) return null;



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <WalletProvider>
        <TransactionProvider>
          <BottomSheetModalProvider>
            <NavigationContainer>
              <PaperProvider>
                <BottomNavigation />
              </PaperProvider>
            </NavigationContainer>
            <Toast />
          </BottomSheetModalProvider>
        </TransactionProvider>
      </WalletProvider>
    </GestureHandlerRootView>

  );
}


