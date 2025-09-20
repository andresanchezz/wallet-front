import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    View,
    FlatList,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    StyleSheet,
    Text,
    SectionList,
    Platform,
    Keyboard,
} from "react-native";
import { useWallets } from "../context/WalletContext";
import { WalletItem } from "../components/WalletItem";
import { useTransactions } from "../context/TransactionContext";
import { TransactionItem } from "../components/TransactionItem";
import { textStyles } from "../theme/textStyles";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet } from "../interfaces/wallet";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Transaction } from "../interfaces/transaction";
import { groupTransactionsByDate } from "../utils/groupByDay";

import { WalletForm } from "../components/WalletForm";
import { TransactionForm } from "../components/TransactionForm";
import { useTransactionForm } from "../hooks/useTransactionForm.hook";
import { useWalletForm } from "../hooks/useWalletForm.hook";

export default function HomeScreen() {
    const { wallets, loadWallets } = useWallets();
    const {
        transactions,
        transactionsByWallet,
        setTransactionsByWallet,
        loadTransactions,
        loadMoreTransactions,
        hasMore,
        loading,
    } = useTransactions();

    const { resetTForm } = useTransactionForm();
    const { resetWForm } = useWalletForm();

    const [refreshing, setRefreshing] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<Wallet>();

    const bottomSheetWallets = useRef<BottomSheet>(null);
    const bottomSheetForms = useRef<BottomSheet>(null);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                pressBehavior="close"
                opacity={0.7}
            />
        ),
        []
    );

    const snapPoints = useMemo(() => ["50%", "90%"], []);

    const sections = groupTransactionsByDate(transactions);

    useEffect(() => {
        loadWallets("8537c041-04d9-4a28-9e6f-5a299b18e61d");
        loadTransactions();
    }, []);

    const handleRefresh = async () => {
        setRefreshing(true);
        await Promise.all([
            loadWallets("8537c041-04d9-4a28-9e6f-5a299b18e61d"),
            loadTransactions(),
        ]);
        setRefreshing(false);
    };

    const [activeForm, setActiveForm] = useState<"wallet" | "transaction" | null>(null);

    const handleOpenForm = (form: "wallet" | "transaction") => {
        setActiveForm(form);
        bottomSheetForms.current?.snapToIndex(0);
    };

    const resetForms = () => {
        Keyboard.dismiss()

        activeForm === 'wallet'
            ? resetWForm()
            : resetTForm()
    }

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>

            <SectionList
                stickySectionHeadersEnabled={false}
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TransactionItem {...item} />}
                renderSectionHeader={({ section }) => (
                    <View style={{ paddingBottom: 12, paddingTop: 4 }}>
                        <Text style={{ fontWeight: "bold", color: "#ff0000ff", }}>{section.title}</Text>
                    </View>
                )}
                ListHeaderComponent={
                    <>
                        <View style={[styles.headerList, { marginTop: 0 }]}>
                            <Text style={textStyles.title}>Wallets</Text>
                            <TouchableOpacity onPress={() => handleOpenForm('wallet')}>
                                <Text style={textStyles.bold}>Add wallet</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList
                            data={wallets}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <WalletItem
                                    {...item}
                                    onPress={() => {
                                        setSelectedWallet(item);
                                        loadTransactions(item.id);
                                        bottomSheetWallets.current?.snapToIndex(0);
                                    }}
                                />
                            )}
                            scrollEnabled={false}
                        />

                        <View style={styles.headerList}>
                            <Text style={textStyles.title}>Transactions</Text>
                            <TouchableOpacity onPress={() => handleOpenForm('transaction')}>
                                <Text style={textStyles.bold}>Add transaction</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                }
                onEndReached={() => {
                    if (hasMore && !loading) loadMoreTransactions();
                }}
                onEndReachedThreshold={0.5}
                ListFooterComponent={loading ? <ActivityIndicator size="small" style={{ margin: 10 }} /> : null}
                contentContainerStyle={{ paddingBottom: 24 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
            />

            <BottomSheet
                ref={bottomSheetWallets}
                snapPoints={snapPoints}
                enableDynamicSizing={false}
                enablePanDownToClose
                onClose={() => setTransactionsByWallet({})}
                backdropComponent={renderBackdrop}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
            >
                {selectedWallet && (
                    <BottomSheetFlatList
                        data={transactionsByWallet[selectedWallet.id] || []}
                        keyExtractor={(item: Transaction) => item.id}
                        renderItem={({ item }: { item: Transaction }) => (
                            <TransactionItem {...item} />
                        )}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    />
                )}
            </BottomSheet>

            <BottomSheet
                ref={bottomSheetForms}
                snapPoints={snapPoints}
                backdropComponent={renderBackdrop}
                enableDynamicSizing={false}
                onClose={() => resetForms()}
                keyboardBehavior="interactive"
                keyboardBlurBehavior="restore"
                enableBlurKeyboardOnGesture={true}
                android_keyboardInputMode="adjustResize"
            >
                <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
                    {activeForm === "wallet" && (
                        <WalletForm onSuccess={() => bottomSheetForms.current?.close()} />
                    )}
                    {activeForm === "transaction" && <TransactionForm />}
                </BottomSheetScrollView>
            </BottomSheet>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    bottomSheet: {
        paddingVertical: 24,
        paddingHorizontal: 16
    },
    headerList: {
        marginTop: 24,
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
})