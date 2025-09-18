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
} from "react-native";
import { useWallets } from "../context/WalletContext";
import { WalletItem } from "../components/WalletItem";
import { useTransactions } from "../context/TransactionContext";
import { TransactionItem } from "../components/TransactionItem";
import { textStyles } from "../theme/textStyles";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Wallet } from "../interfaces/wallet";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Transaction } from "../interfaces/transaction";
import { groupTransactionsByDate } from "../utils/groupByDay";


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

    const [refreshing, setRefreshing] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<Wallet>();

    const ref = useRef<BottomSheet>(null);

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

    const snapPoints = useMemo(() => ["70%"], []);

    const handleBottomModal = useCallback(() => {
        ref.current?.expand();
    }, []);

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

    return (
        <SafeAreaView style={{ flex: 1, padding: 16 }}>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <TransactionItem {...item} />}
                renderSectionHeader={({ section }) => (
                    <View style={{ paddingVertical: 8 }}>
                        <Text style={{ fontWeight: "bold", color: "#ff0000ff", }}>{section.title}</Text>
                    </View>
                )}
                ListHeaderComponent={
                    <>
                        <View style={[styles.headerList, { marginTop: 0 }]}>
                            <Text style={textStyles.title}>Wallets</Text>
                            <TouchableOpacity onPress={() => handleBottomModal()}>
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
                                        ref.current?.snapToIndex(0);
                                    }}
                                />
                            )}
                            scrollEnabled={false}
                        />

                        <View style={styles.headerList}>
                            <Text style={textStyles.title}>Transactions</Text>
                            <TouchableOpacity onPress={() => handleBottomModal()}>
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

            <BottomSheet ref={ref} snapPoints={snapPoints}
                enableDynamicSizing={false}
                enablePanDownToClose
                onClose={() => setTransactionsByWallet({})}
                backdropComponent={renderBackdrop}
            >
                {
                    selectedWallet && (
                        <BottomSheetFlatList
                            data={transactionsByWallet[selectedWallet.id] || []}
                            keyExtractor={(item: Transaction) => item.id}
                            renderItem={({ item }: { item: Transaction }) => <TransactionItem {...item} />}
                            style={styles.bottomSheet}
                        >
                        </BottomSheetFlatList>
                    )
                }
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