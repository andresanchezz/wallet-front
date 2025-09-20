import { StyleSheet, Text, View } from "react-native";


export const FormField: React.FC<{
    label: string;
    children: React.ReactNode;
}> = ({ label, children }) => (
    <View style={styles.field}>
        <Text style={styles.label}>{label}</Text>
        {children}
    </View>
);

const styles = StyleSheet.create({
    field: {
        marginBottom: 12,
    },
    label: {
        fontWeight: "500",
        marginBottom: 4,
    },
})