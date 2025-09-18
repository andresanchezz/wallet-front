import { StyleSheet, Text, View } from "react-native"
import { Transaction } from "../interfaces/transaction"
import { formatCOP } from "../utils/formatCurrency"

import Ionicons from '@expo/vector-icons/Ionicons';
import { textStyles } from "../theme/textStyles";
import { cardStyles } from "../theme/cardStyles";

export const TransactionItem: React.FC<Transaction> = ({ amount, name, wallet, category, type }) => {

    return (
        <View style={cardStyles.card}>

            <Ionicons name={category?.icon as any || 'logo-apple-ar'} size={24} color="black" />
            <View style={styles.middleCol}>
                <Text style={textStyles.itemName}>{name}</Text>
                <Text style={textStyles.small}>{wallet?.name || 'vacío'}</Text>
            </View>

            <View>
                <Text
                    style={[
                        textStyles.itemName,
                        {
                            color:
                                type === 'EXPENSE' ? 'red' :
                                    type === 'INCOME' ? 'green' :
                                        'black',
                        }
                    ]}
                >
                    {type === 'EXPENSE' ? '-' : ''}{formatCOP(amount)} COP
                </Text>

                <Text style={[textStyles.small, { alignSelf: 'flex-end' }]}>{category?.name}</Text>
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    middleCol: {
        flex: 1,
        marginLeft: 16,
    },
})