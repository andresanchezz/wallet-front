import { StyleSheet, Text, View } from "react-native"
import { Transaction } from "../interfaces/transaction"
import { formatCOP } from "../utils/formatCurrency"

import Ionicons from '@expo/vector-icons/Ionicons';
import { textStyles } from "../theme/textStyles";
import { cardStyles } from "../theme/cardStyles";

export const TransactionItem: React.FC<Transaction> = ({ amount, name, wallet, category, type, direction }) => {

    return (
        <View style={cardStyles.card}>

            <Ionicons style={[styles.icon, { backgroundColor: `#${category.color}` }]} name={category?.icon as any} size={20} color={'white'} />
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
                                type === 'INCOME'
                                    ? 'green'
                                    : type === 'EXPENSE'
                                        ? 'red'
                                        : 'black',
                        },
                    ]}
                >
                    {type === 'EXPENSE' || (type === 'TRANSFER' && direction === 'OUT') ? '-' : ''}
                    {formatCOP(amount)} COP
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
    icon: {
        padding: 8,
        borderRadius: 100
    }
})