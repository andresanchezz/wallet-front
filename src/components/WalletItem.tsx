import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Wallet } from "../interfaces/wallet"
import { formatCOP } from "../utils/formatCurrency"
import { cardStyles } from "../theme/cardStyles"
import { textStyles } from "../theme/textStyles"

type WalletItemProps = Wallet & {
    onPress: () => void;
};

export const WalletItem: React.FC<WalletItemProps> = ({ balance, name, type, accruedInterest, interestRate, onPress }) => {

    const hasInterest = interestRate !== undefined && interestRate !== null

    return (
        <TouchableOpacity style={cardStyles.card} onPress={onPress}>

            <View>
                <Text style={textStyles.itemName}>{name}</Text>
                <Text style={textStyles.small}>
                    {hasInterest
                        ? `${interestRate}% E.A`
                        : `No interest rate`}
                </Text>
                <Text style={textStyles.small}>{type.toLocaleLowerCase()}</Text>
            </View>

            <View>
                <Text style={textStyles.itemName}>{formatCOP(balance)} COP</Text>
                <Text style={[styles.textRight, textStyles.small]}>
                    {hasInterest
                        ? `+ ${formatCOP(accruedInterest!)} COP`
                        : ''}
                </Text>
                <Text></Text>
            </View>

        </TouchableOpacity>
    )

}

const styles = StyleSheet.create({
    textRight: {
        alignSelf: "flex-end"
    }
})